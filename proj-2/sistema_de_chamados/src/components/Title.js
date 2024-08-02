// Title.js
import React from 'react';

const Title = ({ name }) => {
  return (
    <div style={styles.title}>
      {name}
    </div>
  );
};

const styles = {
  title: {
    textAlign: 'center', 
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
};

export default Title;
