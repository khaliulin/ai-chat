import { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarProps } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Badge } from 'primereact/badge';
import { Icon24Hours } from '@tabler/icons-react';
import { Group } from '../../common/Group';
import WalterImg from '../../img/walter.jpg';
import AmyelsnerImg from '../../img/amyelsner.png';
import AsiyajavayantImg from '../../img/asiyajavayant.png';

const meta = {
  title: 'Components/Misc/Avatar',
  component: Avatar,
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Avatar</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

const shapes: AvatarProps['shape'][] = ['circle', 'square', undefined];

const sizes: AvatarProps['size'][] = ['normal', 'large', 'xlarge', undefined];

export const Default: Story = {
  args: {
    shape: undefined,
    size: undefined,
    unstyled: false,
  },
  render: () => {
    return (
      <div>
        <Group title="Basic">
          <div className="flex gap-4">
            <Avatar label="B" />
            <Avatar label="John Doe" image={WalterImg} />
          </div>
        </Group>
        <Group title="Shapes" className="flex gap-4">
          {shapes.map(shape => (
            <>
              {shape != undefined && (
                <div className="flex flex-col gap-4">
                  <span>{shape || 'undefined'}</span>
                  <Avatar
                    label={shape.charAt(0).toUpperCase()}
                    shape={shape == undefined ? undefined : shape}
                  />
                </div>
              )}
            </>
          ))}
        </Group>
        <Group title="Sizes" className="flex gap-4">
          <div className="flex gap-8">
            <div>
              <p className="mb-2 text-center font-bold">Square</p>
              <div className="flex gap-4">
                {sizes.map(size => (
                  <>
                    {size != undefined && (
                      <div className="flex flex-col gap-4">
                        <span>{size || 'undefined'}</span>
                        <Avatar
                          label={size.charAt(0).toUpperCase()}
                          size={size}
                        />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-center font-bold">Circle</p>
              <div className="flex gap-4">
                {sizes.map(size => (
                  <>
                    {size != undefined && (
                      <div className="flex flex-col gap-4">
                        <span>{size || 'undefined'}</span>
                        <Avatar
                          label={size.charAt(0).toUpperCase()}
                          size={size}
                          shape="circle"
                        />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </Group>
        <Group
          title="Icon"
          description={
            <>
              При передаче иконки нужно ей добавить класс{' '}
              <strong>p-avatar-icon</strong>.
            </>
          }
        >
          <Avatar icon={<Icon24Hours className="p-avatar-icon" />} />
          <Avatar
            size="large"
            icon={<Icon24Hours className="p-avatar-icon" />}
            className="ml-8"
          />
          <Avatar
            size="xlarge"
            icon={<Icon24Hours className="p-avatar-icon" />}
            className="ml-8"
          />
        </Group>
        <Group
          title="Badge"
          description={
            <>
              Компонент <strong>Badge</strong> размещается внутри{' '}
              <strong>Avatar</strong>. На компонент <strong>Avatar</strong>{' '}
              нужно добавить класс <strong>p-overlay-badge</strong>.
            </>
          }
        >
          <Avatar label="U" size="xlarge" className="p-overlay-badge">
            <Badge value="4" severity="danger" />
          </Avatar>
          <Avatar
            label="U"
            size="xlarge"
            shape="circle"
            className="p-overlay-badge ml-8"
          >
            <Badge value="4" severity="danger" />
          </Avatar>
        </Group>
        <Group title="Avatar Group">
          <AvatarGroup>
            <Avatar image={AmyelsnerImg} size="large" shape="circle" />
            <Avatar image={AsiyajavayantImg} size="large" shape="circle" />
            <Avatar label="+2" shape="circle" size="large" />
          </AvatarGroup>
        </Group>
      </div>
    );
  },
};
