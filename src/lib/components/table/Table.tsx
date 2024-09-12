import React from 'react';
import { Title } from '../Title';
import clsx from 'clsx';
import { IconEmptyTable } from '../icons/IconEmptyTable';

export interface TableProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  selectable?: boolean;
}

function Root({ children, title, actions }: TableProps) {
  return (
    <div>
      <div className="flex flex-col">
        {title && <Title actions={actions}>{title}</Title>}
        <div className="border-2 border-slate-700 rounded-md">
          <table className="table">{children}</table>
        </div>
      </div>
    </div>
  );
}

interface TableHeadProps {
  children?: React.ReactNode;
}

function Head({ children }: TableHeadProps) {
  return (
    <thead className="border-b-2 border-b-slate-700">
      <tr>{children}</tr>
    </thead>
  );
}

interface TableBodyProps {
  children?: React.ReactNode;
}

function Body({ children }: TableBodyProps) {
  const count = React.Children.count(children);
  return (
    <tbody>
      {count === 0 && (
        <tr>
          <td colSpan={1000}>
            <div className="flex flex-col items-center gap-3 pt-1 pb-1">
              <IconEmptyTable size="2.5rem" />
              <div className="font-semibold">No Items</div>
            </div>
          </td>
        </tr>
      )}
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children?: React.ReactNode;
  onSelected?: () => void;
  isSelected?: boolean;
}

function Row({ children, onSelected, isSelected = false }: TableRowProps) {
  return (
    <tr className={clsx('cursor-pointer hover:bg-base-200', isSelected && 'bg-base-200')} onClick={onSelected}>
      {children}
    </tr>
  );
}

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
}

function Cell({ children, className }: TableCellProps) {
  return <td className={className}>{children}</td>;
}

interface HeaderCellProps {
  children?: React.ReactNode;
}

function HeaderCell({ children }: HeaderCellProps) {
  return <th>{children}</th>;
}

export const Table = { Root, Head, Body, Row, Cell, HeaderCell };
