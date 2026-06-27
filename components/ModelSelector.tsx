interface ModelOption {
  id: string;
  name: string;
}

interface Props {
  model: string;
  setModel: (model: string) => void;
  models: ModelOption[];
}

export default function ModelSelector({ model, setModel, models }: Props) {
  return (
    <select
      value={model}
      onChange={(e) => setModel(e.target.value)}
      className="bg-gray-800 text-xs rounded-lg px-3 py-2 border border-gray-700 outline-none focus:border-violet-500 transition-colors cursor-pointer"
    >
      {models.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  );
}
