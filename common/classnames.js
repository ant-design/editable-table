import classnames from 'classnames';
import { startsWith, map } from 'lodash-es';

export default (styles, prefix = styles.prefix) => {
  const cx = classnames.bind(styles);
  const handlePrefix = name => {
    if (startsWith(name, ':')) return name.replace(':', '');
    return `${prefix}-${name}`;
  };
  return (...names) =>
    cx(
      map(names, name => {
        if (typeof name === 'string') {
          return handlePrefix(name);
        }
        if (typeof name === 'object') {
          const returnObj = {};
          for (const key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
              const element = name[key];
              returnObj[handlePrefix(key)] = element;
            }
          }
          return returnObj;
        }
        return '';
      }),
    );
};
