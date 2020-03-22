# @umi-material/EditableTable

基于antd的高性能可编辑表单

## Install
```shell
npm i -S antd-editabletable
```

## Usage
1. 通过columns控制表单元素（用于每一列为同一种表单类型）
```jsx
    import EditableTable from 'antd-editabletable';
    const getConfig = (formItemType) => {
       const map = {
         RADIO: {
          options: [
            { name: 'a', value: 'a' },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
        SELECT: {
            options: [
              { name: 'a', value: 'a' },
              { name: 'b', value: 'b' },
            ],
            validateRules: [{ required: true, message: '请选择' }],
        },
        INPUT:{
          value: `${parseInt(Math.random() * 100, 10)}`,
          validateRules: [{ required: true, message: '请输入' }],
        },
        INPUT_NUMBER:{
          value: `${parseInt(Math.random() * 100, 10)}`,
          validateRules: [{ required: true, message: '请输入' }],
        },
        TEXTAREA:{
          value: `${parseInt(Math.random() * 100, 10)}`,
          validateRules: [{ required: true, message: '请输入' }],
        },
        DATE_PICKER: {
          validateRules: [{ required: true, message: '请选择' }],
        },
        CASCADER: {
          options: [
            { name: 'a', value: 'a', children: [{ name: 'a-1', value: 'a-1' }] },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
        CHECKBOX: {
          options: [
            { name: 'a', value: 'a' },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
        TREE_SELECT: {
          options: [
            { name: 'a', value: 'a', children: [{ name: 'a-1', value: 'a-1' }] },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
      }
      return {
        formItemType,
        ...map[formItemType],
      }
    }
    const getNewRecord = key => {
      return {
        key,
        RADIO: undefined,
        SELECT: undefined,
        INPUT: undefined,
        INPUT_NUMBER: undefined,
        TEXTAREA: undefined,
        DATE_PICKER: undefined,
        CASCADER: undefined,
        CHECKBOX: undefined,
        TREE_SELECT: undefined,
      };
    };

    const getColumns = () => {
      return [
        'RADIO',
        'SELECT',
        'INPUT',
        'INPUT_NUMBER',
        'TEXTAREA',
        'DATE_PICKER',
        'CASCADER',
        'CHECKBOX',
        'TREE_SELECT',
      ].map(type => ({
        dataIndex: type,
        title: type,
        ...getConfig(type),
      }));
    };
    const [dataSource, setDataSource] = React.useState([getNewRecord('1'),getNewRecord('2'),getNewRecord('3')]);
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
    return (
      <EditableTable 
        pagination={false}
        size="middle"
        showAdd
        rowKey={record => record.key}
        onAdd={() => {
           setDataSource([...dataSource, getNewRecord(`${dataSource.length+1}`)]);
        }}
        addText="添加"
        columns={getColumns()}
        dataSource={dataSource}
        onChange={(key, value, record, newDataSource) => {
          setDataSource(newDataSource);
        }}
        scroll={{y:window.innerHeight - 300}}
        rowSelection={{
            selectedRowKeys,
            onChange: newSelectedRowKeys => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
            hideDefaultSelections: false,
            getCheckboxProps: record => {
            return {
                disabled: record.key==='2',
            };
        },
        }}
    />
    );
```
2. 通过dataSource控制表单元素（用于每一列和每一行为不同表单类型）
```jsx
const getConfig = (formItemType) => {
       const map = {
         RADIO: {
          options: [
            { name: 'a', value: 'a' },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
        SELECT: {
            options: [
              { name: 'a', value: 'a' },
              { name: 'b', value: 'b' },
            ],
            validateRules: [{ required: true, message: '请选择' }],
        },
        INPUT:{
          validateRules: [{ required: true, message: '请输入' }],
        },
        INPUT_NUMBER:{
          validateRules: [{ required: true, message: '请输入' }],
        },
        TEXTAREA:{
          validateRules: [{ required: true, message: '请输入' }],
        },
        DATE_PICKER: {
          validateRules: [{ required: true, message: '请选择' }],
        },
        CASCADER: {
          options: [
            { name: 'a', value: 'a', children: [{ name: 'a-1', value: 'a-1' }] },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
        CHECKBOX: {
          options: [
            { name: 'a', value: 'a' },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
        TREE_SELECT: {
          options: [
            { name: 'a', value: 'a', children: [{ name: 'a-1', value: 'a-1' }] },
            { name: 'b', value: 'b' },
          ],
          validateRules: [{ required: true, message: '请选择' }],
        },
      }
      return {
        formItemType,
        ...map[formItemType],
      }
    };
    const getRandomFromItemType = ()=>{
      return [
        'RADIO',
        'SELECT',
        'INPUT',
        'INPUT_NUMBER',
        'TEXTAREA',
        'DATE_PICKER',
        'CASCADER',
        'CHECKBOX',
        'TREE_SELECT',
      ][parseInt(Math.random()*7,10)]
    }
    const getNewRecord = key => {
      return {
        key,
        col1: getConfig(getRandomFromItemType()),
        col2: getConfig(getRandomFromItemType()),
        col3: getConfig(getRandomFromItemType()),
        col4: getConfig(getRandomFromItemType()),
        col5: getConfig(getRandomFromItemType()),
        col6: getConfig(getRandomFromItemType()),
        col7: getConfig(getRandomFromItemType()),
        col8: getConfig(getRandomFromItemType()),
        col9: getConfig(getRandomFromItemType()),
      };
    };

    const getColumns = () => {
      return [
        'col1',
        'col2',
        'col3',
        'col4',
        'col5',
        'col6',
        'col7',
        'col8',
        'col9',
      ].map(type => ({
        dataIndex: type,
        title: type,
      }));
    };
    const [dataSource, setDataSource] = React.useState([getNewRecord('1'),getNewRecord('2'),getNewRecord('3')]);
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
    return (
      <EditableTable 
        pagination={false}
        size="middle"
        showAdd
        rowKey={record => record.key}
        onAdd={() => {
           setDataSource([...dataSource, getNewRecord(`${dataSource.length+1}`)]);
        }}
        addText="添加"
        columns={getColumns()}
        dataSource={dataSource}
        onChange={(key, value, record, newDataSource) => {
          setDataSource(newDataSource);
        }}
        scroll={{y:window.innerHeight - 300}}
        rowSelection={{
            selectedRowKeys,
            onChange: newSelectedRowKeys => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
            hideDefaultSelections: false,
            getCheckboxProps: record => {
            return {
                disabled: record.key==='2',
            };
        },
        }}
    />
    )
```

## LICENSE
MIT

