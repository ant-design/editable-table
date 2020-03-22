import React, { Component } from 'react';
import EditableTable from 'antd-editabletable';
import styles from './index.less';

class TestPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  getNewRecord = key => {
    return {
      key,
      RADIO: {
        formItemType: 'RADIO',
        options: [
          { name: 'a', value: 'a' },
          { name: 'b', value: 'b' },
        ],
        validateRules: [{ required: true, message: '请选择' }],
      },
      SELECT: {
        formItemType: 'SELECT',
        options: [
          { name: 'a', value: 'a' },
          { name: 'b', value: 'b' },
        ],
        value: 'a',
        validateRules: [{ required: true, message: '请选择' }],
      },
      INPUT: {
        formItemType: 'INPUT',
        value: `${parseInt(Math.random() * 100, 10)}`,
        validateRules: [{ required: true, message: '请输入' }],
      },
      INPUT_NUMBER: {
        formItemType: 'INPUT_NUMBER',
        value: `${parseInt(Math.random() * 100, 10)}`,
        validateRules: [{ required: true, message: '请输入' }],
      },
      TEXTAREA: {
        formItemType: 'TEXTAREA',
        value: `${parseInt(Math.random() * 100, 10)}`,
        validateRules: [{ required: true, message: '请输入' }],
      },
      DATE_PICKER: {
        formItemType: 'DATE_PICKER',
        validateRules: [{ required: true, message: '请选择' }],
      },
      CASCADER: {
        formItemType: 'CASCADER',
        options: [
          { name: 'a', value: 'a', children: [{ name: 'a-1', value: 'a-1' }] },
          { name: 'b', value: 'b' },
        ],
        validateRules: [{ required: true, message: '请选择' }],
      },
      CHECKBOX: {
        formItemType: 'CHECKBOX',
        options: [
          { name: 'a', value: 'a' },
          { name: 'b', value: 'b' },
        ],
        validateRules: [{ required: true, message: '请选择' }],
      },
      TREE_SELECT: {
        formItemType: 'TREE_SELECT',
        options: [
          { name: 'a', value: 'a', children: [{ name: 'a-1', value: 'a-1' }] },
          { name: 'b', value: 'b' },
        ],
        validateRules: [{ required: true, message: '请选择' }],
      },
    };
  };

  getColumns = () => {
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
    }));
  };
  
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      dataSource: (() => {
        const ds = [];
        for (let index = 0; index < 20; index += 1) {
          ds.push(this.getNewRecord(`${index + 1}`));
        }
        return ds;
      })(),
    };
  }

  validateRules = [];

  getValidateFieldsMethod = validateFields => {
    this.validateRules.push(validateFields);
  };

  render() {
    const { dataSource, selectedRowKeys } = this.state;
    return (
      <div className={styles.container}>
        <EditableTable
          pagination={false}
          size="middle"
          showAdd
          rowKey={record => record.key}
          onAdd={() => {
            this.setState({
              dataSource: [...dataSource, this.getNewRecord(`${dataSource.length + 1}`)],
            });
          }}
          addText="添加"
          columns={this.getColumns()}
          getValidateFieldsMethod={this.getValidateFieldsMethod}
          dataSource={dataSource}
          onChange={(key, value, record, newDataSource) => {
            this.setState({ dataSource: newDataSource });
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: newSelectedRowKeys => {
              this.setState({ selectedRowKeys: newSelectedRowKeys });
            },
            hideDefaultSelections: false,
            getCheckboxProps: record => {
              return {
                disabled: record.key === '3',
              };
            },
          }}
        />
        <button
          type="button"
          onClick={async () => {
            const result = await Promise.all(this.validateRules.map(v => v()));
            console.log(result);
          }}
        >
          校验表单
        </button>
      </div>
    );
  }
}

export default TestPage;
