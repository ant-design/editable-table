import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import getHasValue from './getHasValue';
import { ROW_SELECTION, CLASSNAME_PREFIX } from './constant';
import classnames from '../../common/classnames';
import styles from './index.less';

const cx = classnames(styles, CLASSNAME_PREFIX);

const EditableRow = ({
  record,
  myRowKey,
  index,
  validateFieldFns,
  changeFields,
  className,
  children,
  onChange,
  columns,
}) => {
  const rowKeyStr = `${myRowKey ? myRowKey(record, index) || index : index}`;
  const [form] = Form.useForm();
  useEffect(() => {
    validateFieldFns.push(async () => {
      try {
        await form.validateFields();
        return false;
      } catch (error) {
        if (error) {
          if (!changeFields.hasError) {
            changeFields.hasError = true;
            form.scrollToField(((form.getFieldsError() || [])[0] || {}).name);
          }
          return true;
        }
        return false;
      }
    });
    return () => {
      // eslint-disable-next-line no-param-reassign
      delete changeFields[rowKeyStr];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const trKey = myRowKey ? myRowKey(record, index) || index : index;
  const fields = [];
  const columMap = columns.reduce((reuslt, current) => {
    return { ...reuslt, [current.dataIndex]: current };
  }, {});
  Object.keys(record || {}).forEach(key => {
    if (key === ROW_SELECTION) return;
    const column = columMap[key];
    if (!column || column.render) {
      return;
    }
    const hasValue = getHasValue(record[key]);
    if (hasValue && record[key] && record[key].render) {
      return;
    }
    fields.push({
      ...(changeFields[trKey] || {})[key],
      name: key,
      value: hasValue ? record[key].value : record[key],
    });
  });
  return (
    <tr key={rowKeyStr} className={cx('edit-row', className || '')}>
      <Form
        form={form}
        component={false}
        fields={fields}
        onValuesChange={(changedValues, allValues) => {
          const key = Object.keys(changedValues)[0];
          const value = changedValues[key];
          const column = columns.find(c => c.dataIndex === key) || {};
          const hasValue = getHasValue(record[key]);
          if (hasValue) {
            const newRecord = { ...record };
            if (!newRecord[key]) {
              newRecord[key] = {};
            }
            newRecord[key].value = value;
            onChange(
              key,
              value,
              newRecord,
              newRecord[key].formItemType || column.formItemType || 'INPUT',
            );
          } else {
            onChange(
              key,
              value,
              Object.assign({}, record, allValues),
              column.formItemType || 'INPUT',
            );
          }
        }}
        onFieldsChange={(props, _changeFields) => {
          const key = myRowKey ? myRowKey(record, index) || index : index;
          Object.assign(changeFields, {
            [key]: {
              ...changeFields[key],
              ..._changeFields,
            },
          });
        }}
      >
        {children}
      </Form>
    </tr>
  );
};
EditableRow.propTypes = {
  validateFieldFns: PropTypes.arrayOf(PropTypes.func),
  record: PropTypes.shape({}),
  index: PropTypes.number,
  myRowKey: PropTypes.func,
  className: PropTypes.string,
  changeFields: PropTypes.shape({}),
};

export default EditableRow;
