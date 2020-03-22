/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash-es';
import classnames from '../common/classnames';
import { ROW_SELECTION, CLASSNAME_PREFIX } from './constant';
import EditableCell from './EditableCell';
import EditableFormRow from './EditableFormRow';
import styles from './EditableTable.less';

const cx = classnames(styles, CLASSNAME_PREFIX);

class EditableTable extends Component {
  constructor() {
    super();
    this.validateFieldFns = [];
    this.changeFields = {};
  }

  validateField = () => {
    let result = false;
    this.validateFieldFns.forEach(v => {
      const r = v();
      result = result || r;
    });
    return result;
  };

  componentDidMount() {
    const { getValidateFieldsMethod } = this.props;
    if (getValidateFieldsMethod) {
      getValidateFieldsMethod(this.validateField);
    }
  }

  componentWillUnmount() {
    this.changeFields = {};
  }

  debounceChange = debounce((key, value, newRecord, newDataSource, index, rowKey) => {
    const { onChange } = this.props;
    onChange(key, value, newRecord, newDataSource, index, rowKey);
  }, 200);

  render() {
    const {
      rowClassName,
      rowKey,
      columns,
      dataSource,
      onChange,
      rowSelection,
      showAdd,
      onAdd,
      addText,
      disabled,
      header,
      headerExtra,
      className,
      addBtnClassName,
      ...restProps
    } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    let newColumns = columns;
    if (rowSelection) {
      newColumns = [
        {
          dataIndex: ROW_SELECTION,
          width: 40,
          className: cx('table-selection'),
          title: () => {
            const allKeys = [];
            (dataSource || []).forEach((record, index) => {
              if (
                !rowSelection.getCheckboxProps ||
                (!disabled && !(rowSelection.getCheckboxProps(record, index) || {}).disabled)
              ) {
                allKeys.push(rowKey(record, index));
              }
            });
            const checked =
              (rowSelection.selectedRowKeys || []).length > 0 &&
              !allKeys.find(key => !(rowSelection.selectedRowKeys || []).find(rk => rk === key));
            return (
              <div>
                {rowSelection.type === 'radio' || rowSelection.hideDefaultSelections ? null : (
                  <Checkbox
                    indeterminate={!checked && (rowSelection.selectedRowKeys || []).length > 0}
                    checked={checked}
                    disabled={disabled}
                    onChange={e => {
                      if (!rowSelection.onChange) return;
                      if (e.target.checked) {
                        rowSelection.onChange(allKeys);
                      } else {
                        rowSelection.onChange([]);
                      }
                    }}
                  />
                )}
              </div>
            );
          },
        },
      ].concat(newColumns);
    }
    newColumns = newColumns.map((col, columnIndex) => {
      return {
        ...col,
        onCell: (record, index) => ({
          record,
          dataIndex: col.dataIndex,
          column: col,
          index,
          columnIndex,
          disabled,
          rowSelection,
          rowKey,
        }),
      };
    });
    return (
      <div className={cx('container', `:${className || ''}`)}>
        {header ? (
          <div className={cx('header')}>
            {header}
            {headerExtra && <div className={cx('header-extra')}>{headerExtra}</div>}
          </div>
        ) : null}
        <Table
          rowKey={rowKey}
          onRow={(record, index) => ({
            record,
            myRowKey: rowKey, //必须改名，才能把rowKey传进去
            columns: newColumns,
            index,
            changeFields: this.changeFields,
            validateFieldFns: this.validateFieldFns,
            className: rowClassName && rowClassName(record, index),
            onChange: (key, value, newRecord, formItemType) => {
              const newDataSource = [...dataSource];
              const target = newDataSource[index];
              Object.assign(target, newRecord);
              if (typeof key === 'string') {
                if (['INPUT', 'TEXTAREA'].includes(formItemType)) {
                  this.debounceChange(
                    key,
                    value,
                    newRecord,
                    newDataSource,
                    index,
                    rowKey && rowKey(newRecord),
                  );
                } else {
                  onChange(
                    key,
                    value,
                    newRecord,
                    newDataSource,
                    index,
                    rowKey && rowKey(newRecord),
                  );
                }
              }
            },
          })}
          components={components}
          dataSource={dataSource}
          columns={newColumns}
          footer={() =>
            !disabled &&
            showAdd && (
              <div className={cx('footer')}>
                <div
                  onClick={onAdd}
                  role="button"
                  className={cx('btn-wrap', `:${addBtnClassName || ''}`)}
                >
                  <PlusOutlined className={cx('plus-btn-icon')} />
                  <Button type="link" className={cx('plus-btn')}>
                    {addText}
                  </Button>
                </div>
              </div>
            )
          }
          {...restProps}
        />
      </div>
    );
  }
}

EditableTable.propTypes = {
  className: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  headerExtra: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showAdd: PropTypes.bool,
  addBtnClassName: PropTypes.string,
  onAdd: PropTypes.func,
  addText: PropTypes.string,
  disabled: PropTypes.bool,
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowKey: PropTypes.func,
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      validateRules: PropTypes.arrayOf(PropTypes.object),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          name: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ),
  rowSelection: PropTypes.shape({
    type: PropTypes.oneOf(['radio', 'checkbox']),
    selectedRowKeys: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    getCheckboxProps: PropTypes.func,
    hideDefaultSelections: PropTypes.bool,
  }),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataIndex: PropTypes.string,
      key: PropTypes.string,
      render: PropTypes.func,
      formItemType: PropTypes.oneOf([
        'RADIO',
        'SINGLE',
        'INPUT',
        'TEXTAREA',
        'DATE_PICKER',
        'CASCADER',
        'CHECKBOX',
        'TREE_SELECT',
      ]),
    }),
  ),
  onChange: PropTypes.func,
  getValidateFieldsMethod: PropTypes.func,
};

EditableTable.defaultProps = { rowKey: (record, index) => `${index}` };

export default EditableTable;
