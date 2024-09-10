export function RoleTags(props: { tags: string[] }) {
  const { tags } = props;
  return (
    <div className="flex flex-row gap-1">
      {tags.length == 0 && '—'}
      {tags.map((tag) => {
        return (
          <div key={tag} className="badge badge-neutral">
            {tag}
          </div>
        );
      })}
    </div>
  );
}
