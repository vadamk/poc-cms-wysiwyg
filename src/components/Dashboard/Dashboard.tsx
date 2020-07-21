import React from 'react';
import cx from 'classnames';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';

import RichEditor from 'components/RichEditor';

import sty from './Dashboard.module.scss';

const defaultValue = `
  <p>
    One way to find a job is to actually let the job find you. You do this by building a strong reputation and a clear platform for your own communication. Maybe even do a campaign that spreads, shares, and ends up in front of the right
    person. We will discuss this in more detail in <a href="https://google.com/" target="_blank">this guide</a>.
  </p>
  <p>In addition, if we simplify greatly, there are two main ways to find possible jobs:</p>
  <ul>
    <li>You will find jobs that are advertised. This is what we call visible jobs and the most common thing is to find job ads on large job sites.</li>
    <li>You are looking for jobs that are not advertised. This is usually called a hidden job and the main way to find them is through contacts.</li>
  </ul>
  <p>There are many more hidden jobs than visible jobs. It is a typical iceberg. You know, as you say, only a small part of the iceberg is visible above the surface. The rest is below the water surface and invisible to us.</p>
  <p>
    <span> <img src="/image.png" /> </span>
  </p>
  <p>
    <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://player.vimeo.com/video/437769465/"></iframe>
  </p>
  <ul>
    <li>Writing an ad</li>
    <li>Many vacancies are not advertised</li>
    <li>Staffing company is used</li>
  </ul>
  <ol>
    <li>Writing an ad</li>
    <li>Many vacancies are not advertised</li>
    <li>Staffing company is used</li>
  </ol>
  <p>Searches for certain titles or certain employers and sometimes check out what shows up. When the right job shows up, you move on with it.</p>
  <p>
    But if you decide that your next job is coming soon, then you must have a different strategy. Spend less time on advertised jobs and more time on other actions.
    <span style="background-color: rgb(250, 204, 204);">We recommend that you spend a maximum of 20% of your time on advertised jobs.</span> This means that if you apply for a job five days a week, you should only spend one of those days on
    job listings.
  </p>
`;

const Dashboard: React.FC = () => {
  const [isMobileMode, setMobileMode] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    document.documentElement.style.fontSize = isMobileMode ? '12px' : '100%';
  }, [isMobileMode]);

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleToggle = () => {
    setMobileMode(!isMobileMode);
  };

  return (
    <div className={sty.dashboard}>
      <header>
        <span
          role="button"
          className={sty.switchMode}
          aria-disabled={!isMobileMode}
          onClick={handleToggle}
        >
          <DesktopOutlined />
        </span>
        <span
          role="button"
          className={sty.switchMode}
          aria-disabled={isMobileMode}
          onClick={handleToggle}
        >
          <MobileOutlined />
        </span>
      </header>
      <div className={cx(sty.content, isMobileMode && sty.mobile)}>
        <RichEditor value={value} onChange={handleChange} />
      </div>
    </div>
  );
};

export default Dashboard;
