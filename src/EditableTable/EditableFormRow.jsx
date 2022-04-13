import React, { useEffect, useRef } from 'react';
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
  className,
  children,
  onChange,
  columns,
  ...props
}) => {
  const formRef = useRef({});
  const rowKeyStr = `${myRowKey ? myRowKey(record, index) || index : index}`;
  useEffect(() => {
    const validataFn = async () => {
      let hasError = false;
      try {
        if (formRef && formRef.current && formRef.current.validateFields) {
          await formRef.current.validateFields();
        }
      } catch (error) {
        const firstField = ((((error || {}).errorFields || [])[0] || {}).name || [])[0];
        if (firstField) {
          if (formRef && formRef.current && formRef.current.submit) {
            formRef.current.submit();
          }
          hasError = true;
        }
      }
      return hasError;
    };
    validateFieldFns.push(validataFn);
    return () => {
      validateFieldFns.splice(
        validateFieldFns.findIndex((v) => v === validataFn),
        1,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fields = [];
  const columMap = columns.reduce((reuslt, current) => {
    return { ...reuslt, [current.dataIndex]: current };
  }, {});
  Object.keys(record || {}).forEach((key) => {
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
      name: key,
      value: hasValue ? record[key].value : record[key],
    });
  });
  return (
    <tr {...props} key={rowKeyStr} className={cx('edit-row', className || '')}>
      <Form
        ref={formRef}
        fields={fields}
        component={false}
        scrollToFirstError
        onValuesChange={(changedValues, allValues) => {
          const key = Object.keys(changedValues)[0];
          const value = changedValues[key];
          const column = columns.find((c) => c.dataIndex === key) || {};
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
  onChange: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  children: PropTypes.node,
};

export default EditableRow;
