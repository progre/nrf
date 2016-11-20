import * as React from "react";

export default function Footer(props: {
    needRestart: boolean;
    onRestart: () => void;
}) {
    return (
        <fieldset className="text-right">
            <div className="row">
                <div className="col-sm-12">
                    <button
                        type="button"
                        onClick={() => props.onRestart()}
                        className={[
                            "btn",
                            props.needRestart ? "btn-primary" : "btn-secondary"
                        ].join(" ")}
                        >
                        Apply settings
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    When you apply the settings, the started broadcast stops.
                </div>
            </div>
        </fieldset>
    );
}
