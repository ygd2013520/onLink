# __author__ = 'Jeff'

import re
from fs.btrfs import (scan_disks, wipe_disk, blink_disk, enable_quota,
											btrfs_uuid, pool_usage, mount_root, shares_info,
											pool_raid, add_pool,resize_pool,umount_root,remount,
											add_share, remove_share, update_quota, share_usage,
                      set_property, mount_share,qgroup_id, qgroup_create,
											qgroup_info)

from fs.pools import list_pools
from system import smart
import logging

logger = logging.getLogger(__name__)

MNT_PT = '/mnt2/'
MIN_DISK_SIZE = 1024 * 1024


def btrfs_disk_scan():
	data = scan_disks(MIN_DISK_SIZE)
	# print data
	disks = []
	for d in data:
		dob = {}
		if d.name == "centos-root":
			continue
		dob["name"] = d.name
		dob["size"] = d.size
		dob["parted"] = d.parted
		dob["offline"] = False
		dob["model"] = d.model
		dob["transport"] = d.transport
		dob["vendor"] = d.vendor
		dob["btrfs_uuid"] = d.btrfs_uuid
		if (d.fstype is not None and d.fstype != 'btrfs'):
			dob["btrfs_uuid"] = None
			dob["parted"] = True
		if d.fstype == 'isw_raid_member' \
			or d.fstype == 'linux_raid_member':
			dob["role"] = d.fstype
		else:
			dob["role"] = None
		if (d.root is True):
			dob["role"] = 'root'
		dob["pool"] = d.label
		dob["serial"] = d.serial
		disks.append(dob)

	for do in disks:
		# print "for"
		# if (not do["offline"]):
		if (re.match("vd|md|mmcblk", do["name"]) is not None):
			do["smart_available"] = False
			do["smart_enabled"] = False
			continue
		try:
			do["smart_available"], do["smart_enabled"] = smart.available(
				do["name"], "")
		except Exception, e:
			# logger.exception(e)
			do["smart_available"] = False
			do["smart_enabled"] = False

	return disks


def btrfs_disk_wipe(dname):
	disks = btrfs_disk_scan()
	for disk in disks:
		if disk["name"] == dname:
			wipe_disk(dname)
			disk["parted"] = False
			disk["btrfs_uuid"] = None
			return disk

	return None


def btrfs_disk_import(dname):
	try:
		disks = btrfs_disk_scan()
		for disk in disks:
			print disk["name"]
			# pool = get_pool_info(disk["name"])
			if disk["name"] == dname:
				disk["parted"] = False
				# mount_root(po)
				# po.raid = pool_raid('%s%s' % (MNT_PT, po.name))['data']
				# po.size = pool_usage('%s%s' % (MNT_PT, po.name))[0]
				# po.save()
				# enable_quota(po)
				# import_shares(po, request)
				# for share in Share.objects.filter(pool=po):
				# 		import_snapshots(share)
				return disk

	except Exception, e:
		e_msg = ('Failed to import any pool on this device(%s). Error: %s'
						 % (dname, e.__str__()))


def smart_control(dname, enable=False):
	disks = btrfs_disk_scan()
	for disk in disks:
		if disk["name"] == dname:
			if (not disk["smart_available"]):
				e_msg = ('S.M.A.R.T support is not available on this Disk(%s)' % dname)
				return e_msg
			smart.toggle_smart(disk["name"], "", enable)
			disk["smart_enabled"] = enable
			return disk
	return None


def btrfs_pool_scan():
	pools = list_pools()
	disks = btrfs_disk_scan()
	for pool in pools:
		disks_pool = []
		for disk in pool["disks"]:
			for disk_d in disks:
				if disk.split("/")[2] == disk_d["name"]:
					# print disk_d["name"]
					disks_pool.append(disk_d)
					if disk_d["role"] == "root":
						pool["role"] = "root"
		pool["disks"] = disks_pool
	return pools


def btrfs_add_pool(pool):
	disks = btrfs_disk_scan()
	disks_pool = []
	for disk in pool["disks"]:
		for disk_d in disks:
			if disk == disk_d["name"]:
				disks_pool.append(disk_d)
	dnames = [d["name"] for d in disks_pool]
	pool["disks"] = disks_pool
	add_pool(pool,dnames)
	pool["size"] = pool_usage(mount_root(pool))[0]
	pool["uuid"] = btrfs_uuid(dnames[0])
	return pool


def btrfs_rem_pool(pname):
	pool_path = ('%s%s' % (MNT_PT, pname))
	umount_root(pool_path)
	return "over"

def btrfs_share_scan():
	pools = btrfs_pool_scan()
	shares = []
	for pool in pools:
		info = shares_info(pool)
		for i in range(len(info.keys())):
			share = {}
			share["name"] = info.keys()[i]
			share["subvol_name"] = info.keys()[i]
			share["group"] = info[info.keys()[i]]
			share["pool"] = pool
			qid = qgroup_id(pool, share["subvol_name"])
			cur_rusage, cur_eusage = share_usage(pool, qid)
			share["rusage"] = cur_rusage
			share["eusage"] = cur_eusage
			share["pqgroup"] = "xxx"
			# print qgroup_info(pool)
			shares.append(share)
	return shares


def btrfs_add_share(share):
	pools = btrfs_pool_scan()
	share_s = {}
	for pool in pools:
		if pool["name"] == share["pool"]:
			pqid = qgroup_create(pool)
			add_share(pool, share["sname"], pqid)
			qid = qgroup_id(pool, share["sname"])
			update_quota(pool, pqid, share["size"] * 1024)
			mnt_pt = '%s%s' % (MNT_PT, share["sname"])
			replica = False
			share_s["name"] = share["sname"]
			share_s["subvol_name"] = share["sname"]
			share_s["size"] = share["size"]
			share_s["qgroup"] = qid
			share_s["pqgroup"] = pqid
			share_s["pool"] = pool
			share_s["replica"] = replica
			share_s["compression_algo"] = share["compression"]
			mount_share(share_s, mnt_pt)
	return share_s


def btrfs_rem_share(sname, command=''):
	force = True if (command == 'force') else False
	shares = btrfs_share_scan()
	for share in shares:
		if share["name"] == sname:
			remove_share(share["pool"], share["subvol_name"], share["pqgroup"], force=force)
	return "over"