import {React, useContext} from "react";
import noteContext from '../context/notes/noteContext';

export default function Alert() {
    const context = useContext(noteContext);
    const {alrtState} = context;

  return (
    <div style={{height:'60px'}}>
      {alrtState.vis && <div className={`alert alert-${alrtState.type.toLowerCase()} alert-dismissible fade show`} role="alert">
        <strong>{alrtState.type}</strong>: {alrtState.msg}
      </div>}
    </div>
  );
}