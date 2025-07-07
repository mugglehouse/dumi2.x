import React, { PropsWithChildren } from "react";

/**
 * The props type for {@link CardA}.
 */
export interface CardAProps {
    /** The theme of the card. Defaults to `primary`. */
    variant: "primary" | "secondary" | "success" | "danger" | "light" | "dark";
}

/**
 * Renders a card around some content.
 *
 * This is our recommended way to define React components as it makes your code
 * more readable. The minor drawback is you must click the `CardAProps` link to
 * see the component's props.
 *
 * @category Component
 */
// export function CardA({ children, variant = "primary" }: PropsWithChildren<CardAProps>): React.ReactElement {
//     return <div className={`card card-${variant}`}>{children}</div>;
// }
