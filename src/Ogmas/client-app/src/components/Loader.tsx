import CircularProgress from "@material-ui/core/CircularProgress";

interface Props<T> {
  render: (t: T) => JSX.Element;
  resource: T | undefined;
  condition?: (t: T | undefined) => boolean;
}

export const Loader = <T extends any>(props: Props<T>) => {
  const predicate = props.condition || ((t?: T) => !!t);

  if(predicate(props.resource)) {
    return props.render(props.resource!);
  } else {
    return <CircularProgress />;
  }
};