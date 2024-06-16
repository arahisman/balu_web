import React from 'react';
import { useSelector } from 'react-redux';
import colors from './styles';

const HeaderTitle = ({p = 'screen'}) => {
  const theme = useSelector(state => state.app.theme);

  return (
    <div
      style={{
        width: '100%',
        height: 60,
        backgroundColor: colors[theme].color1,
        flexDirection: 'row',
        elevation: 10,
        shadowColor: colors[theme].color12,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 20,
      }}>
      <p
        style={{
          color: colors[theme].color3,
          fontWeight: '600',
          fontSize: 20,
          justifyContent: 'center',
          textAlign: 'center',
          margin:10,
          position: 'absolute',
          left: 0,
          right: 0,
        }}>
        {p}
      </p>
    </div>
  );
};

export default HeaderTitle;
