# __author__ = 'Jeff'

import subprocess
import re
import os
from btrfs import (scan_disks, wipe_disk, blink_disk, enable_quota,
											btrfs_uuid, pool_usage, mount_root, get_pool_info,
											pool_raid)
MNT_PT = '/mnt2/'

def list_pools():
	proc = subprocess.Popen(["/sbin/btrfs", "filesystem", "show"],
													stdout=subprocess.PIPE, stderr=subprocess.PIPE,
													shell=False)
	output, error = proc.communicate()
	output = output.split('\n')
	pools = []
	for i in range(len(output)):
		line = output[i]
		pool = {}
		if (re.match("Label:", line) is not None):
			l_fields = line.split()
			name = l_fields[1][1:-1]
			uuid = l_fields[3]
			path = "/%s/%s" % (MNT_PT, name)
			if os.path.isdir(path) is not True:
				continue
			pool["name"] = name
			pool["uuid"] = uuid
			num_devices = int(output[i + 1].split()[2])
			disks=[]
			for j in range(num_devices):
				disk = output[i + 2 + j].split()[-1]
				disks.append(disk)
			pool["disks"]=disks

			usage = pool_usage('/%s/%s' % (MNT_PT, pool["name"]))
			pool["size"] = usage[0]
			pool["free"] = usage[2]
			pool["raid"] = pool_raid('%s%s' % (MNT_PT, pool["name"]))['data']
			pool["reclaimable"] = 0
			pool["mnt_options"] = None
			pool["role"] = None
			pools.append(pool)

	return pools
