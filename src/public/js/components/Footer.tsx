import * as React from 'react';

export default function Footer(props: {
  needApply: boolean;
  nginx: boolean | null;
  nginxErrorReasons: string[];
  ffmpeg: boolean | null;
  ffmpegErrorReasons: string[];
  onApply(): void;
}) {
  return (
    <div>
      <hr />
      <fieldset>
        <div className="row">
          <div className="push-sm-1 col-sm-3">
            <span style={{ marginRight: '1em' }}>Nginx</span>
            <Status value={props.nginx} errorReasons={props.nginxErrorReasons} />
          </div>
          <div className="col-sm-3">
            <span style={{ marginRight: '1em' }}>FFmpeg</span>
            <Status value={props.ffmpeg} errorReasons={props.ffmpegErrorReasons} />
          </div>
          <div className="col-sm-5" style={{ textAlign: 'right' }}>
            <button
              type="button"
              // tslint:disable-next-line:react-this-binding-issue
              onClick={() => props.onApply()}
              className={[
                'btn',
                props.needApply ? 'btn-primary' : 'btn-secondary',
              ].join(' ')}
            >
              Apply settings
            </button>
          </div>
        </div>
        <div className="row" style={{ textAlign: 'right' }}>
          <div
            className="col-sm-12"
            style={
              props.needApply
                ? {}
                : { display: 'none' }
            }
          >
            When you apply the settings, the started broadcast stops.
          </div>
        </div>
      </fieldset>
    </div>
  );
}

function Status(props: { value: boolean | null; errorReasons: string[]; }) {
  switch (props.value) {
    case true: return <i className="fa fa-check-circle" style={{ color: 'green' }} />;
    case false: return (
      <i
        className="fa fa-exclamation-circle"
        style={{ color: 'red' }}
        title={props.errorReasons.join('\n')}
      />
    );
    case null: return <i className="fa fa-moon-o" />;
    default: throw new Error();
  }
}
