import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { NavMenu } from './NavMenu';

interface Props {
  children: React.ReactNode;
}

export const Layout = (props: Props) => (
  <div>
    <NavMenu />
    <Container maxWidth="md">
      <CssBaseline/>
      <div>
        {props.children}
      </div>
    </Container>
  </div>
);
