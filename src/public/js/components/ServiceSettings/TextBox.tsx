import * as React from 'react';

export default function TextBox(props: {
  id: string;
  placeholder?: string;
  value: string;
  onValueChange(value: string): void;
}) {
  return (
    <input
      style={{ width: '100%' }}
      type="text"
      id={props.id}
      className="form-control"
      value={props.value}
      placeholder={props.placeholder}
      onChange={e => props.onValueChange((e.target as HTMLInputElement).value)}
    />
  );
}
