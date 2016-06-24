export class Config {
  constructor() {
  }

  //TODO: refine the structure for users to easy typing
  pluginTree() {
    var treeData = {
      name: 'Root',
      children: [
        {
          name: 'DemoComponents',
          children: [
            {name: 'HelloWorld'},
            {name: 'Angular2Table'},
            {name: 'BootstrapComp'},
            //{name: 'NgChart'},
          ]
        },
        {
          name: '存储',
          children: [
            {name: 'Disks'},
            {name: 'Pools'},
            {name: 'iSCSI'},
            {name:'共享'},
            {name:'快照'},
            {
              name:'备份',
              children:[
                {name:'发送'},
                {name:'接收'}
              ]
            },
            {
              name:'文件共享服务',
              children:[
                {name:'NFS'},
                {name:'Samba'},
                {name:'SFTP'},
                {name:'AFP'}
              ]
            }
          ]
        }
      ]
    };
    return treeData;
  }
}