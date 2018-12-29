import * as React from 'react';

interface IInfoboxProps {
  style?: React.CSSProperties,
  animate?: boolean,
  vintage?: boolean,
  title?: string | JSX.Element,
  children?: JSX.Element | JSX.Element[],
};

const InfoBox = (props: IInfoboxProps): JSX.Element => {

  const style = {
    ...props.style,
    animation: props.animate ? '.7s ease-out 0s 1 vintage-display' : '',
  }

  const vintage = props.vintage || false;

  return (
    <div
      style={style}
      className={`info-box ${vintage ? 'vintage' : ''}`}
    >

      <span className='info-head'>
        {vintage && (
          <span className='info-prompt'>
            {'root@root~:'}&nbsp;
          </span>
        )}

        <span className='info-title'>{ props.title } </span>

        {vintage && <span className='blinking'>{'_'}</span>}

      </span>

      <div className="container-fluid" style={{ margin: '1rem auto' }}>
        {props.children}
      </div>

    </div>
  )
}

export default InfoBox;
