import { Meta, StoryObj } from '@storybook/react';
import { BreadCrumb, BreadCrumbProps } from 'primereact/breadcrumb';
import { MenuItem, MenuItemOptions } from 'primereact/menuitem';
import {
  IconBook,
  IconCalculator,
  IconChevronCompactRight,
  IconHome,
  IconShoppingBag,
  IconSitemap,
  IconWallet,
} from '@tabler/icons-react';
import { Group } from '../../common/Group';

const meta = {
  title: 'Components/Menu/Breadcrumb',
  component: BreadCrumb,
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Breadcrumb</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BreadCrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

const iconItemTemplate = (item: MenuItem, options: MenuItemOptions) => {
  return (
    <a className={options.className}>
      <div className="cursor-pointer">
        {item.icon}
        {item.label && <span className="ml-2">{item.label}</span>}
      </div>
    </a>
  );
};

const items: BreadCrumbProps['model'] = [
  { label: 'Electronics', icon: <IconSitemap /> },
  { label: 'Computer', icon: <IconBook /> },
  { label: 'Accessories', icon: <IconWallet /> },
  { label: 'Keyboard', icon: <IconShoppingBag /> },
  { label: 'Wireless', icon: <IconCalculator /> },
];

const itemsWithIcons: MenuItem[] = [
  {
    icon: <IconSitemap className="icon-xl inline-block" />,
    label: 'Sitemap',
    template: iconItemTemplate,
  },
  {
    icon: <IconBook className="icon-xl inline-block" />,
    label: 'Book',
    template: iconItemTemplate,
  },
  {
    icon: <IconWallet className="icon-xl inline-block" />,
    label: 'Wallet',
    template: iconItemTemplate,
  },
  {
    icon: <IconShoppingBag className="icon-xl inline-block" />,
    label: 'Shopping Bag',
    template: iconItemTemplate,
  },
  {
    icon: <IconCalculator className="icon-xl inline-block" />,
    label: 'Calculator',
    template: iconItemTemplate,
  },
];

const home: BreadCrumbProps['home'] = {
  icon: <IconHome className="icon-xl" />,
  url: '/?path=/story/components-menu-breadcrumb--default',
};

export const Default: Story = {
  args: {
    separatorIcon: null,
    model: items,
    home: home,
    unstyled: false,
  },
  render: () => {
    return (
      <div>
        <Group
          title="Basic"
          description={
            <>
              На иконку для пропса <strong>home</strong> нужно добавить класс{' '}
              <strong>icon-xl</strong>
            </>
          }
        >
          <BreadCrumb model={items} home={home} />
        </Group>
        <Group
          title="Separator Icon"
          description={
            <>
              Иконку-разделитель можно изменить с помощью свойства{' '}
              <strong>separatorIcon</strong>.
            </>
          }
        >
          <BreadCrumb
            model={items}
            home={home}
            separatorIcon={<IconChevronCompactRight />}
          />
        </Group>
        <Group
          title="Template"
          description={
            <>
              Пользовательский контент можно разместить внутри пункта меню,
              используя свойство <strong>template</strong>.
            </>
          }
        >
          <BreadCrumb model={itemsWithIcons} home={home} />
        </Group>
      </div>
    );
  },
};
