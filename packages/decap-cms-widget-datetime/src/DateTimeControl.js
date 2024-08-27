import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { DatetimeField } from 'decap-cms-ui-next';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(utc);

class DateTimeControl extends React.Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    forID: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    classNameWrapper: PropTypes.string.isRequired,
    setActiveStyle: PropTypes.func.isRequired,
    setInactiveStyle: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    t: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
  };

  static defaultProps = {
    isDisabled: false,
  };

  isUtc = this.props.field.get('picker_utc') || false;

  escapeZ(str) {
    if (/Z(?![\]])/.test(str)) {
      return str.replace('Z', '[Z]');
    }
    return str;
  }

  getFormat() {
    const { field } = this.props;
    let inputType = 'datetime-local';
    let inputFormat = 'YYYY-MM-DDTHH:mm';
    let format = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
    let userFormat = field?.get('format');
    let dateFormat = field?.get('date_format');
    let timeFormat = field?.get('time_format');
    if (dateFormat === true) dateFormat = 'YYYY-MM-DD';
    if (timeFormat === true) timeFormat = 'HH:mm';

    if (this.isUtc) {
      userFormat = this.escapeZ(userFormat);
      dateFormat = this.escapeZ(dateFormat);
      timeFormat = this.escapeZ(timeFormat);
    }

    if (typeof dateFormat === 'string' && typeof timeFormat === 'string') {
      format = `${dateFormat}T${timeFormat}`;
    } else if (typeof timeFormat === 'string') {
      inputType = 'time';
      format = timeFormat;
    } else if (typeof dateFormat === 'string') {
      inputType = 'date';
      format = dateFormat;
    }

    if (typeof userFormat === 'string') {
      format = userFormat;
      inputType = 'datetime-local';
    }

    if (dateFormat === false) inputType = 'time';
    if (timeFormat === false) inputType = 'date';
    if (inputType === 'datetime-local') inputFormat = 'YYYY-MM-DDTHH:mm';
    if (inputType === 'date') inputFormat = 'YYYY-MM-DD';
    if (inputType === 'time') inputFormat = 'HH:mm';

    return { format, inputType, inputFormat };
  }

  isValidDate = dt => dayjs(dt, this.getFormat().inputFormat).isValid() || dt === '';

  getNow() {
    const { inputFormat } = this.getFormat();
    return this.isUtc ? dayjs.utc().format(inputFormat) : dayjs().format(inputFormat);
  }

  formatInputValue(value) {
    if (value === '') return value;
    const { format, inputFormat } = this.getFormat();

    if (typeof value === 'string' && value?.replace(/\s+/g, '') === '{{now}}') {
      return this.getNow();
    }

    const inputValue = this.isUtc
      ? dayjs.utc(value, format).format(inputFormat)
      : dayjs(value, format).format(inputFormat);

    if (this.isValidDate(inputValue)) {
      return inputValue;
    }
    return this.isUtc ? dayjs.utc(value).format(inputFormat) : dayjs(value).format(inputFormat);
  }

  handleChange = datetime => {
    if (!this.isValidDate(datetime)) return;
    const { onChange } = this.props;

    if (datetime === '') {
      onChange('');
    } else {
      const { format, inputFormat } = this.getFormat();
      const formattedValue = dayjs(datetime, inputFormat).format(format);
      onChange(formattedValue);
    }
  };

  onInputChange = e => {
    const etv = e.target.value;
    this.handleChange(etv);
  };

  shortcuts({ t }) {
    return {
      [t('editor.editorWidgets.datetime.now')]: this.handleChange(this.getNow()),
      [t('editor.editorWidgets.datetime.clear')]: this.handleChange(''),
    };
  }

  render() {
    const { forID, value, classNameWrapper, setActiveStyle, setInactiveStyle, t, isDisabled } =
      this.props;
    const { inputType, inputFormat } = this.getFormat();

    return (
      <div className={classNameWrapper}>
        <DatetimeField
          name={forID}
          data-testid={forID}
          type={inputType}
          format={inputFormat}
          value={value ? this.formatInputValue(value) : ''}
          onChange={this.onInputChange}
          onFocus={setActiveStyle}
          onBlur={setInactiveStyle}
          shortcuts={!isDisabled && this.shortcuts({ t })}
          readOnly={isDisabled}
        />
        {this.isUtc && (
          <span
            css={css`
              font-size: 0.8em;
              color: #666;
            `}
          >
            UTC
          </span>
        )}
      </div>
    );
  }
}

export default DateTimeControl;
