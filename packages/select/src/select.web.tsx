import * as Select from '@radix-ui/react-select';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAugmentedRef, useControllableState } from '@rnr/hooks';
import * as Slot from '@rnr/slot';
import type {
  ForceMountable,
  PositionedContentProps,
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  SlottableViewProps,
  TextRef,
  ViewRef,
} from '@rnr/types';
import type {
  SelectContentProps,
  SelectItemProps,
  SelectOverlayProps,
  SelectPortalProps,
  SelectRootProps,
  SelectSeparatorProps,
  SelectValueProps,
  Option,
} from './types';

interface IRootContext extends Omit<SelectRootProps, 'defaultValue' | 'defaultOpen'> {
  value: Option;
  onValueChange: (option: Option) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const SelectContext = React.createContext<IRootContext | null>(null);

const Root = React.forwardRef<ViewRef, SlottableViewProps & SelectRootProps>(
  (
    {
      asChild,
      value: valueProp,
      defaultValue,
      onValueChange: onValueChangeProp,
      open: openProp,
      defaultOpen,
      onOpenChange,
      ...viewProps
    },
    ref
  ) => {
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChangeProp,
    });

    function onValueChange(val: string) {
      setValue({ value: val, label: val });
    }

    const Component = asChild ? Slot.View : View;
    return (
      <SelectContext.Provider
        value={{
          value,
          onValueChange: setValue,
          open,
          onOpenChange: setOpen,
        }}
      >
        <Select.Root
          value={value?.value}
          defaultValue={defaultValue?.value}
          onValueChange={onValueChange}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={setOpen}
        >
          <Component ref={ref} {...viewProps} />
        </Select.Root>
      </SelectContext.Provider>
    );
  }
);

Root.displayName = 'RootWebSelect';

function useRootContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select compound components cannot be rendered outside the Select component');
  }
  return context;
}

const Trigger = React.forwardRef<PressableRef, SlottablePressableProps>(
  ({ asChild, role: _role, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { open } = useRootContext();

    React.useLayoutEffect(() => {
      if (augmentedRef.current) {
        const augRef = augmentedRef.current as unknown as HTMLButtonElement;
        augRef.dataset.state = open ? 'open' : 'closed';
        augRef.type = 'button';
      }
    }, [open]);

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Select.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} role='button' disabled={disabled} {...props} />
      </Select.Trigger>
    );
  }
);

Trigger.displayName = 'TriggerWebSelect';

const Value = React.forwardRef<TextRef, SlottableTextProps & SelectValueProps>(
  ({ asChild, placeholder, children, ...props }, ref) => {
    return (
      <Slot.Text ref={ref} {...props}>
        <Select.Value placeholder={placeholder}>{children}</Select.Value>
      </Slot.Text>
    );
  }
);

Value.displayName = 'ValueWebSelect';

function Portal({ container, children }: SelectPortalProps) {
  return <Select.Portal children={children} container={container} />;
}

const Overlay = React.forwardRef<PressableRef, SlottablePressableProps & SelectOverlayProps>(
  ({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props} />;
  }
);

Overlay.displayName = 'OverlayWebSelect';

const Content = React.forwardRef<
  ViewRef,
  SlottableViewProps & PositionedContentProps & SelectContentProps
>(
  (
    {
      asChild = false,
      forceMount: _forceMount,
      align = 'start',
      side = 'bottom',
      position = 'popper',
      sideOffset = 0,
      alignOffset = 0,
      avoidCollisions = true,
      disablePositioningStyle: _disablePositioningStyle,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onInteractOutside: _onInteractOutside,
      onPointerDownOutside,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Select.Content
        onCloseAutoFocus={onCloseAutoFocus}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        position={position}
      >
        <Component ref={ref} {...props} />
      </Select.Content>
    );
  }
);

Content.displayName = 'ContentWebSelect';

const ItemContext = React.createContext<{
  itemValue: string;
  label: string;
} | null>(null);

const Item = React.forwardRef<PressableRef, SlottablePressableProps & SelectItemProps>(
  ({ asChild, closeOnPress = true, label, value, children, ...props }, ref) => {
    return (
      <ItemContext.Provider value={{ itemValue: value, label: label }}>
        <Slot.Pressable ref={ref} {...props}>
          <Select.Item textValue={label} value={value} disabled={props.disabled ?? undefined}>
            <>{children}</>
          </Select.Item>
        </Slot.Pressable>
      </ItemContext.Provider>
    );
  }
);

Item.displayName = 'ItemWebSelect';

function useItemContext() {
  const context = React.useContext(ItemContext);
  if (!context) {
    throw new Error('Item compound components cannot be rendered outside of an Item component');
  }
  return context;
}

const ItemText = React.forwardRef<TextRef, Omit<SlottableTextProps, 'children'>>(
  ({ asChild, ...props }, ref) => {
    const { label } = useItemContext();

    const Component = asChild ? Slot.Text : Text;
    return (
      <Select.ItemText asChild>
        <Component ref={ref} {...props}>
          {label}
        </Component>
      </Select.ItemText>
    );
  }
);

ItemText.displayName = 'ItemTextWebSelect';

const ItemIndicator = React.forwardRef<ViewRef, SlottableViewProps & ForceMountable>(
  ({ asChild, forceMount: _forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Select.ItemIndicator asChild>
        <Component ref={ref} {...props} />
      </Select.ItemIndicator>
    );
  }
);

ItemIndicator.displayName = 'ItemIndicatorWebSelect';

const Group = React.forwardRef<ViewRef, SlottableViewProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.View : View;
  return (
    <Select.Group asChild>
      <Component ref={ref} {...props} />
    </Select.Group>
  );
});

Group.displayName = 'GroupWebSelect';

const Label = React.forwardRef<TextRef, SlottableTextProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.Text : Text;
  return (
    <Select.Label asChild>
      <Component ref={ref} {...props} />
    </Select.Label>
  );
});

Label.displayName = 'LabelWebSelect';

const Separator = React.forwardRef<ViewRef, SlottableViewProps & SelectSeparatorProps>(
  ({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Select.Separator asChild>
        <Component ref={ref} {...props} />
      </Select.Separator>
    );
  }
);

Separator.displayName = 'SeparatorWebSelect';

const ScrollUpButton = (props: React.ComponentPropsWithoutRef<typeof Select.ScrollUpButton>) => {
  return <Select.ScrollUpButton {...props} />;
};

const ScrollDownButton = (
  props: React.ComponentPropsWithoutRef<typeof Select.ScrollDownButton>
) => {
  return <Select.ScrollDownButton {...props} />;
};

const Viewport = (props: React.ComponentPropsWithoutRef<typeof Select.Viewport>) => {
  return <Select.Viewport {...props} />;
};

export {
  Content,
  Group,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Overlay,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
  Viewport,
  useItemContext,
  useRootContext,
};
