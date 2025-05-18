import {SVGProps} from "react";

export function BaselineMinus(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            {...props}
        >
            <path fill="currentColor" d="M19 12.998H5v-2h14z"></path>
        </svg>
    )
}
