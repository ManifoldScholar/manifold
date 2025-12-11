export default function Section({ label, children, className }) {
  return (
    <div className="appearance-menu__section">
      <fieldset className={className}>
        <legend className="control-menu__legend">{label}</legend>
        <div>{children}</div>
      </fieldset>
    </div>
  );
}
