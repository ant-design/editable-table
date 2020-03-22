import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Select,
  Input,
  DatePicker,
  Cascader,
  Checkbox,
  TreeSelect,
  InputNumber,
} from 'antd';

const FormItemType = ({ disabled, formItemType, options, ...restProps }) => {
  switch (formItemType) {
    case 'RADIO': {
      return (
        <Radio.Group {...restProps}>
          {(options || []).map(({ name, value, ...restItem }) => (
            <Radio value={value} key={value} {...restItem}>
              {name}
            </Radio>
          ))}
        </Radio.Group>
      );
    }
    case 'SELECT': {
      return (
        <Select {...restProps}>
          {(options || []).map(({ name, value, disabled, ...restItem }) => (
            <Select.Option value={value} title={name} disabled={disabled} {...restItem}>
              {name}
            </Select.Option>
          ))}
        </Select>
      );
    }
    case 'DATE_PICKER': {
      return <DatePicker disabled={disabled} {...restProps} />;
    }
    case 'CASCADER': {
      const refactor = optionsData =>
        (optionsData || []).map(item => ({
          ...item,
          label: item.label || item.name,
          children: item.children && item.children.length ? refactor(item.children) : undefined,
        }));
      return (
        <Cascader
          options={refactor(options)}
          disabled={disabled}
          {...restProps}
        />
      );
    }
    case 'CHECKBOX': {
      return (
        <Checkbox.Group
          disabled={disabled}
          options={(options || []).map(({ label, name, value, ...restItem }) => ({
            label: label || name,
            value,
            ...restItem,
          }))}
          {...restProps}
        />
      );
    }
    case 'TREE_SELECT': {
      const refactor = optionsData =>
        (optionsData || []).map(item => ({
          ...item,
          title: item.title || item.name,
          children: item.children && item.children.length ? refactor(item.children) : undefined,
        }));
      return <TreeSelect disabled={disabled} treeData={refactor(options)} {...restProps} />;
    }
    case 'TEXTAREA': {
      return <Input.TextArea disabled={disabled} {...restProps} />;
    }
    case 'INPUT_NUMBER':
      return <InputNumber disabled={disabled} {...restProps} />;
    case 'INPUT':
    default:
      return <Input disabled={disabled} {...restProps} />;
  }
};

FormItemType.propTypes = {
  disabled: PropTypes.bool,
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      children: PropTypes.array,
    }),
  ),
};

export default FormItemType;
