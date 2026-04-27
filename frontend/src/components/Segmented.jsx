export default function Segmented({ options, value, onChange }) {
  return (
    <div className="seg" role="tablist">
      {options.map(opt => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          className={`seg-btn${value === opt.value ? ' active' : ''}`}
          onClick={() => { if (value !== opt.value) onChange(opt.value); }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
