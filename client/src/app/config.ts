export class Config {
  constructor() {
  }

  //TODO: refine the structure for users to easy typing
  pluginTree() {
    var treeData = {
      name: 'Root',
      children: [
        {
          name: 'Meat',
          children: [
            {name: 'Beef'},
            {name: 'Pork'},
          ]
        },
        {
          name: 'Seafood',
          children: [
            {
              name: 'Shell',
              children: [
                {name: 'Ag-grid'},
                {name: 'Line-chart'},
              ]
            },
            {
              name: 'Fish',
              children: [
                {name: 'Data-table'},
                {name: 'Dialog-box'},
              ]
            }
          ]
        }
      ]
    };
    return treeData;
  }
}