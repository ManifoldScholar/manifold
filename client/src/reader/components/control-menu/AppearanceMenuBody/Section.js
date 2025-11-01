export default function Section({ label, labelId, children, className }) {
  return (
    <div className="appearance-menu__section">
      <fieldset className={className}>
        <legend id={labelId} className="control-menu__legend">
          {label}
        </legend>
        <div>{children}</div>
      </fieldset>
    </div>
  );
}
