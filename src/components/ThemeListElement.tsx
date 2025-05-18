export interface ThemeListElementProps {
    label: string;
    themeName: string;
}

function ThemeListElement(props: ThemeListElementProps) {
    return (
        <input type="radio" name="theme-dropdown"
               className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
               aria-label={props.label} value={props.themeName}/>
    );
}

export default ThemeListElement;