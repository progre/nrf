import * as React from "react";

export default function Footer(props: {
    needApply: boolean;
    nginx: boolean | null;
    ffmpeg: boolean | null;
    onApply: () => void;
}) {
    return (
        <div>
            <hr />
            <fieldset>
                <div className="row">
                    <div className="push-sm-1 col-sm-3">
                        Nginx <Status value={props.nginx} />
                    </div>
                    <div className="col-sm-3">
                        FFmpeg <Status value={props.ffmpeg} />
                    </div>
                    <div className="col-sm-5" style={{ textAlign: "right" }}>
                        <button
                            type="button"
                            onClick={() => props.onApply()}
                            className={[
                                "btn",
                                props.needApply ? "btn-primary" : "btn-secondary"
                            ].join(" ")}
                            >
                            Apply settings
                        </button>
                    </div>
                </div>
                <div className="row" style={{ textAlign: "right" }}>
                    <div
                        className="col-sm-12"
                        style={
                            props.needApply
                                ? {}
                                : { display: "none" }
                        }
                        >
                        When you apply the settings, the started broadcast stops.
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

function Status(props: { value: boolean | null }) {
    switch (props.value) {
        case true: return <i className="fa fa-check-circle" />;
        case false: return <i className="fa fa-exclamation-circle" />;
        case null: return <i className="fa fa-moon-o" />;
        default: throw new Error();
    }
}
