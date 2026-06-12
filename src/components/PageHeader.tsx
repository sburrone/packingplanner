import { ReactElement } from "react";
import * as React from "react";

interface PageHeaderProps {
  title: string | ReactElement;
}

export const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const { title } = props;

  return (
    <header className={"flex items-center justify-center border-b-4 mb-4 bg-secondary-background h-14 px-4"}>
      {typeof title === "string" ? (
        <h2 className={"flex max-w-full overflow-hidden text-center text-nowrap"}>
          <span className={"shrink-0 text-main"}>{title.slice(0, 1)}</span>
          <span className={"min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"}>{title.slice(1)}</span>
        </h2>
      ) : (
        title
      )}
    </header>
  );
};
