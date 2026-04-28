import { Meta, StoryObj } from '@storybook/react';
import { Divider } from 'primereact/divider';
import { Group } from '../../common/Group';
import { Icon12Hours } from '@tabler/icons-react';

const meta = {
  title: 'Components/Panel/Divider',
  component: Divider,
  argTypes: {
    // align: {
    //   control: {
    //     type: 'select',
    //   },
    //   options: ['center', 'left', 'top', 'bottom', 'right'],
    // },
    // layout: {
    //   control: {
    //     type: 'select',
    //   },
    //   options: ['horizontal', 'vertical'],
    // },
    // type: {
    //   control: {
    //     type: 'select',
    //   },
    //   options: ['dashed', 'dotted', 'solid'],
    // },
    // unstyled: { control: 'boolean' },
  },
  // tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Divider</h2>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => {
    return (
      <div>
        <Group title="Basic">
          <p>Lorem ipsum dolor sit amet...</p>
          <Divider />
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem...
          </p>
          <Divider />
          <p>At vero eos et accusamus et iusto odio dignissimos...</p>
        </Group>
        <Group
          title="Type"
          description={
            <>
              Стиль разделителя могут быть <strong>solid</strong>,{' '}
              <strong>dashed</strong> или <strong>dotted</strong>.
            </>
          }
        >
          <p>Lorem ipsum dolor sit amet...</p>
          <Divider type="solid" />
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem...
          </p>
          <Divider type="dashed" />
          <p>At vero eos et accusamus et iusto odio dignissimos...</p>
          <Divider type="dotted" />
          <p>At vero eos et accusamus et iusto odio dignissimos...</p>
        </Group>
        <Group title="Vertical" className="flex justify-center">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Divider layout="vertical" type="dashed" />
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
          <Divider layout="vertical" />
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident.
          </p>
        </Group>
        <Group
          title="Align (Horizontal)"
          description={<>Выравнивание разделителя по горизонтали</>}
        >
          <p>Lorem ipsum dolor sit amet...</p>
          <Divider align="left">left</Divider>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem...
          </p>
          <Divider align="center">center</Divider>
          <p>At vero eos et accusamus et iusto odio dignissimos...</p>
          <Divider align="right">right</Divider>
          <p>At vero eos et accusamus et iusto odio dignissimos...</p>
        </Group>
        <Group
          title="Align (Vertical)"
          description={<>Выравнивание разделителя по вертикали</>}
          className="flex justify-center"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Divider layout="vertical" align="top">
            top
          </Divider>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
          <Divider layout="vertical" align="center">
            center
          </Divider>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident.
          </p>
          <Divider layout="vertical" align="bottom">
            bottom
          </Divider>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident.
          </p>
        </Group>
        <Group
          title="Content"
          description={
            <>
              Контент внутри разделителя.
              <br />
              Взята иконка <strong>Icon12Hours</strong> и текст для примера.
              Базовый цвет текста для контента можно переопределить с помощью
              классов на элементе. Как в примере ниже, где цвет иконки является
              базовым, а цвет текста переопределён на красный с помощью класса{' '}
              <strong>text-red-600</strong>.
            </>
          }
        >
          <p>Lorem ipsum dolor sit amet...</p>
          <Divider align="left">
            <div className="flex items-center">
              <Icon12Hours className="mr-2"></Icon12Hours>
              <b className="text-red-600">Text</b>
            </div>
          </Divider>
          <p>Lorem ipsum dolor sit amet...</p>
        </Group>
      </div>
    );
  },
};
