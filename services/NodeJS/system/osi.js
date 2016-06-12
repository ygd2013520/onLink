/**
 * Created by Jeff on 2016/4/28.
 */
var HOSTS_FILE = '/etc/hosts';
var MKDIR = '/bin/mkdir';
var RMDIR = '/bin/rmdir';
var CHMOD = '/bin/chmod';
var MOUNT = '/bin/mount';
var UMOUNT = '/bin/umount';
var EXPORTFS = '/usr/sbin/exportfs';
var RESTART = '/sbin/restart';
var SERVICE = '/sbin/service';
var HOSTID = '/usr/bin/hostid';
var DEFAULT_MNT_DIR = '/mnt2/';
var SHUTDOWN = '/usr/sbin/shutdown';
var GRUBBY = '/usr/sbin/grubby';
var CAT = '/usr/bin/cat';
var UDEVADM = '/usr/sbin/udevadm';
var GREP = '/usr/bin/grep';
var NMCLI = '/usr/bin/nmcli';
var HOSTNAMECTL = '/usr/bin/hostnamectl';


var shell = require('shelljs');

exports.run_command = function(cmd){
    var data = shell.exec(cmd, {silent:true}).stdout;
    //console.log("run result: "+data);
    return data;
};
