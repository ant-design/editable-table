import React, { Component } from 'react';
import EditableTable from 'editabletable';
import styles from './index.less';

class TestPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      dataSource: (() => {
        const ds = [];
        for (let index = 0; index < 100; index += 1) {
          ds.push({
            a: {
              value: `${Math.random() * 100}`,
              formItemType: 'INPUT',
              type: 'number',
            },
            b: Math.random() * 100,
            c: Math.random() * 100,
          });
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
          onAdd={() => {
            this.setState({ dataSource: [...dataSource, {}] });
          }}
          addText="添加"
          columns={[
            {
              dataIndex: 'a',
              title: 'a',
            },
            {
              dataIndex: 'b',
              title: 'b',
            },
            {
              dataIndex: 'c',
              title: 'c',
            },
          ]}
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
                disabled: record.a && (record.a === '123' || record.a.value === '123'),
              };
            },
          }}
        />
        <button
          type="button"
          onClick={() => {
            this.validateRules.map(v => v());
          }}
        >
          校验表单
        </button>
      </div>
    );
  }
}

export default TestPage;
