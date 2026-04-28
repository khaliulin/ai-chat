import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const customSnapshotsDir = `${process.cwd()}/__image_snapshots__`;

const testRunner: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await page.setDefaultTimeout(60000); // Увеличьте до 60 секунд или больше, если необходимо
  },
  async postVisit(page, context) {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.03,
      failureThresholdType: 'percent',
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};

export default testRunner;
