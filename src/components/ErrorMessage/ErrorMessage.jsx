import PropTypes from 'prop-types';
import css from './ErrorMessage.module.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className={css.error}>
      <p>{message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
