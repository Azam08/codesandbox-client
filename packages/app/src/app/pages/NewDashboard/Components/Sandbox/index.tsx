import React from 'react';
import { useLocation } from 'react-router-dom';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { SandboxCard } from './SandboxCard';
import { SandboxListItem } from './SandboxListItem';

export const Sandbox = ({ sandbox, isTemplate = false, ...props }) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;

  const [edit, setEdit] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(sandboxTitle);

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewTitle(sandboxTitle);
      setEdit(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    await actions.dashboard.renameSandbox({
      id: sandbox.id,
      title: newTitle,
      oldTitle: sandboxTitle,
    });
    setEdit(false);
  };

  const onBlur = () => {
    // save value when you click outside or tab away
    onSubmit();
  };

  const inputRef = React.useRef(null);
  const enterEditing = () => {
    setEdit(true);
    // Menu defaults to sending focus back to Menu Button
    // Send focus to input in the next tick
    // after menu is done closing.
    setTimeout(() => inputRef.current.focus());
  };

  const sandboxProps = {
    sandboxTitle,
    newTitle,
    sandbox,
    isTemplate,
    url,
    edit,
    inputRef,
    onChange,
    onKeyDown,
    onSubmit,
    onBlur,
    enterEditing,
  };

  const location = useLocation();
  if (dashboard.viewMode === 'list' || location.pathname.includes('deleted')) {
    return (
      <Element style={{ gridColumn: '1/-1' }}>
        <SandboxListItem {...sandboxProps} {...props} />
      </Element>
    );
  }
  return <SandboxCard {...sandboxProps} {...props} />;
};
