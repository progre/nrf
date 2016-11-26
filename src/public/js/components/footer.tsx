import * as React from "react";

export default function Footer(props: {
    needApply: boolean;
    onApply: () => void;
}) {
    return (
        <div>
            <hr />
            <fieldset style={{ textAlign: "right" }}>
                <div className="row">
                    <div className="col-sm-12">
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
                <div className="row">
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
