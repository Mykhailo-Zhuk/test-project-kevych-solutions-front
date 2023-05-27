import React from 'react';
import classes from './Trips.module.css';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';

const Trip = (props) => {
  const { start, end, when } = props.trip;
  return (
    <div className={classes.box_selector}>
      <div className={classes.box_selector__item}>{start}</div>
      <div className={classes.box_selector__item}>
        <BsFillArrowRightCircleFill />
      </div>
      <div className={classes.box_selector__item}>{end}</div>
      <div className={classes.box_selector__item}>{when}</div>
    </div>
  );
};

export default Trip;
