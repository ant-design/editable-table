import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { ROW_SELECTION, CLASSNAME_PREFIX } from './constant';
import classnames from '../common/classnames';
import styles from './EditableTable.less';
import EditableContext from './EditableContext';

const cx = classnames(styles, CLASSNAME_PREFIX);

const EditableRow = ({
  form,
  record,
  myRowKey,
  index,
  validateFieldFns,
  changeFields,
  className,
  ...props
}) => {
  const rowKeyStr = `${myRowKey ? myRowKey(record, index) || index : index}`;
  useEffect(() => {
    validateFieldFns.push(() => {
      let validateStatus = false;
      form.validateFieldsAndScroll(undefined, { force: true }, err => {
        if (err) {
          validateStatus = true;
        }
      });
      return validateStatus;
    });
    return () => {
      // eslint-disable-next-line no-param-reassign
      delete changeFields[rowKeyStr];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} key={rowKeyStr} className={cx('edit-row', className || '')} />
    </EditableContext.Provider>
  );
};
EditableRow.propTypes = {
  form: PropTypes.shape({ validateFieldsAndScroll: PropTypes.func }),
  validateFieldFns: PropTypes.arrayOf(PropTypes.func),
  record: PropTypes.shape({}),
  index: PropTypes.number,
  myRowKey: PropTypes.func,
  className: PropTypes.string,
  changeFields: PropTypes.shape({}),
};

const EditableFormRow = Form.create({
  mapPropsToFields(props) {
    const { record, columns, changeFields, myRowKey, index } = props;
    const trKey = myRowKey ? myRowKey(record, index) || index : index;
    const fields = {};
    const columMap = columns.reduce((reuslt, current) => {
      return { ...reuslt, [current.dataIndex]: current };
    }, {});
    Object.keys(record || {}).forEach(key => {
      if (key === ROW_SELECTION) return;
      const column = columMap[key];
      if (!column || column.render) {
        return;
      }
      const hasValue =
        record[key] && typeof record[key] === 'object' && 'value' in (record[key] || {});
      if (hasValue && record[key] && record[key].render) {
        return;
      }
      fields[key] = Form.createFormField({
        ...(changeFields[trKey] || {})[key],
        value: hasValue ? record[key].value : record[key],
      });
    });
    return fields;
  },
  onValuesChange(props, changedValues, allValues) {
    const { onChange, record, columns } = props;
    const key = Object.keys(changedValues)[0];
    const value = changedValues[key];
    const column = columns.find(c => c.dataIndex === key) || {};
    const hasValue =
      record[key] && typeof record[key] === 'object' && 'value' in (record[key] || {});
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
  },
  onFieldsChange(props, _changeFields) {
    const { myRowKey, record, index, changeFields } = props;
    const key = myRowKey ? myRowKey(record, index) || index : index;
    Object.assign(changeFields, {
      [key]: {
        ...changeFields[key],
        ..._changeFields,
      },
    });
  },
})(EditableRow);

export default EditableFormRow;
