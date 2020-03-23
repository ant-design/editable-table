import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Checkbox } from 'antd';
import { omit } from 'lodash-es';
import { Form } from 'antd';
import getHasValue from './getHasValue';
import findCascaderPath from '../../common/findCascaderPath';
import FormItemType from './FormItemType';
import { ROW_SELECTION } from './constant';

export default class EditableCell extends Component {
  static propTypes = {
    dataIndex: PropTypes.string,
    record: PropTypes.shape({}),
    index: PropTypes.number,
    columnIndex: PropTypes.number,
    disabled: PropTypes.bool,
    column: PropTypes.shape({
      render: PropTypes.func,
      editable: PropTypes.bool,
      readonly: PropTypes.bool,
      formItemType: PropTypes.oneOf([
        'RADIO',
        'SELECT',
        'INPUT',
        'INPUT_NUMBER',
        'TEXTAREA',
        'DATE_PICKER',
        'CASCADER',
        'CHECKBOX',
        'TREE_SELECT',
      ]),
      validateRules: PropTypes.arrayOf(PropTypes.object),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          name: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
      prefixElement: PropTypes.func,
      suffixElement: PropTypes.func,
      cellClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      shouldUpdate: PropTypes.func,
    }),
    rowSelection: PropTypes.shape({
      type: PropTypes.oneOf(['radio', 'checkbox']),
      selectedRowKeys: PropTypes.arrayOf(PropTypes.string),
      onChange: PropTypes.func,
      getCheckboxProps: PropTypes.func,
    }),
    rowKey: PropTypes.func,
  };

  renderName = (value, formItemType, options = []) => {
    if (!value) return '';
    if (formItemType === 'CASCADER') {
      return findCascaderPath(options, value)
        .map(p => p.label)
        .join('、');
    }
    if (formItemType.indexOf('SELECT') !== -1) {
      if (value instanceof Array) {
        return value
          .map(v => (options.find(o => o.value === v) || {}).name)
          .filter(n => n)
          .join('、');
      }
      return (options.find(o => o.value === value) || {}).name;
    }
    return value;
  };

  renderCell = () => {
    const {
      dataIndex,
      record,
      column,
      index,
      rowSelection,
      rowKey,
      columnIndex,
      disabled: disabledProps,
    } = this.props;
    const cellKey = `${dataIndex}-${columnIndex}-${
      rowKey ? rowKey(record, index) || index : index
    }`;
    if (dataIndex === ROW_SELECTION) {
      if (rowSelection) {
        const tdKey = rowKey(record, index);
        const checked = (rowSelection.selectedRowKeys || []).indexOf(tdKey) > -1;
        return (
          <td key={`td-${cellKey}`}>
            {rowSelection.type === 'radio' ? (
              <Radio
                key={cellKey}
                checked={checked}
                value={tdKey}
                onChange={e => {
                  if (!rowSelection.onChange) return;
                  if (e.target.checked && !checked) {
                    rowSelection.onChange([...(rowSelection.selectedRowKeys || []), tdKey]);
                  }
                  if (!e.target.checked && checked) {
                    rowSelection.onChange(
                      (rowSelection.selectedRowKeys || []).filter(k => k !== tdKey),
                    );
                  }
                }}
                {...{
                  ...(rowSelection.getCheckboxProps &&
                    rowSelection.getCheckboxProps(record, index)),
                  ...(disabledProps ? { disabled: disabledProps } : null),
                }}
              />
            ) : (
              <Checkbox
                key={cellKey}
                checked={checked}
                onChange={e => {
                  if (!rowSelection.onChange) return;
                  if (e.target.checked && !checked) {
                    rowSelection.onChange([...(rowSelection.selectedRowKeys || []), tdKey]);
                  }
                  if (!e.target.checked && checked) {
                    rowSelection.onChange(
                      (rowSelection.selectedRowKeys || []).filter(k => k !== tdKey),
                    );
                  }
                }}
                {...{
                  ...(rowSelection.getCheckboxProps &&
                    rowSelection.getCheckboxProps(record, index)),
                  ...(disabledProps ? { disabled: disabledProps } : null),
                }}
              />
            )}
          </td>
        );
      }
      return <td key={`td-${cellKey}`}></td>;
    }
    const {
      validateRules = [],
      options = [],
      formItemType: columnType,
      editable,
      readonly,
      render,
      prefixElement,
      suffixElement,
      cellClassName = '',
      shouldUpdate: columnShouldUpdate,
      ...restColumnProps
    } = column || {};
    const {
      validateRules: recordValidateRules,
      options: recordOptions,
      formItemType: recordType,
      editable: recordEditable,
      readonly: recordReadonly,
      render: recordRender,
      shouldUpdate: recordShouldUpdate,
      ...restRecordProps
    } = record[dataIndex] || {};
    const lEditable = recordEditable !== undefined ? recordEditable : editable;
    const lReadonly = recordReadonly || readonly;
    const disabled = lEditable === undefined ? false : !lEditable;
    const renderFn = recordRender || render;
    const formItemType = recordType || columnType || 'INPUT';
    const ops = recordOptions || options;
    const shouldUpdate = recordShouldUpdate || columnShouldUpdate || ((prevValue, curValue) => prevValue !== curValue);
    return (
      <td key={`td-${cellKey}`}>
        <div
          className={
            typeof cellClassName === 'function'
              ? cellClassName(record[dataIndex], record, index)
              : cellClassName
          }
        >
          {prefixElement ? prefixElement(record[dataIndex], record, index) : null}
          {renderFn ? (
            renderFn(record[dataIndex], record, index)
          ) : (
            <Form.Item
              style={{ margin: 0 }}
              key={`form-item-${cellKey}`}
              name={dataIndex}
              rules={recordValidateRules || validateRules || []}
              shouldUpdate={shouldUpdate}
            >
              {lReadonly ? (
                this.renderName(
                  getHasValue(record[dataIndex]) ? record[dataIndex].value : record[dataIndex],
                  formItemType,
                  ops,
                )
              ) : (
                <FormItemType
                  key={cellKey}
                  disabled={disabledProps || disabled}
                  formItemType={formItemType}
                  options={ops}
                  {...{
                    ...omit(restColumnProps, ['value', 'onChange']),
                    ...omit(restRecordProps, ['value', 'onChange']),
                  }}
                />
              )}
            </Form.Item>
          )}
          {suffixElement ? suffixElement(record[dataIndex], record, index) : null}
        </div>
      </td>
    );
  };

  render() {
    return this.renderCell();
  }
}
