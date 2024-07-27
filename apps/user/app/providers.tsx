"use client"
import { AppbarClient } from "../components/AppbarClient";
import { RecoilRoot } from "recoil"
import { SessionProvider } from "next-auth/react"
import React from "react"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { css } from '@emotion/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (<RecoilRoot>
        < SessionProvider>
        <AppRouterCacheProvider options={{ key: 'css' }}>
            <AppbarClient />
            {children}
        </AppRouterCacheProvider>
        </SessionProvider>
    </RecoilRoot>)
}