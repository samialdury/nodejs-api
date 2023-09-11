/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as hcloud from '@pulumi/hcloud'
import * as pulumi from '@pulumi/pulumi'

const sshConfig = new pulumi.Config('ssh')
const serverConfig = new pulumi.Config('server')
const ipConfig = new pulumi.Config('ip')

const sshKeyName = sshConfig.require('key_name')

const sshKey = new hcloud.SshKey(
    sshKeyName,
    {
        name: sshKeyName,
        publicKey: sshConfig.requireSecret('public_key'),
    },
    {
        protect: true,
    },
)

async function getCloudflareIpRanges(type: 'v4' | 'v6'): Promise<string[]> {
    const response = await fetch(`https://www.cloudflare.com/ips-${type}`)
    const text = await response.text()
    return text.split('\n')
}

const cloudflareIpV4Ranges = await getCloudflareIpRanges('v4')
const cloudflareIpV6Ranges = await getCloudflareIpRanges('v6')

const cloudflareFirewall = new hcloud.Firewall(
    'cloudflare-firewall',
    {
        name: 'cloudflare-firewall',
        rules: [
            {
                description: 'Allow HTTP access from Cloudflare IPs',
                direction: 'in',
                port: '80',
                protocol: 'tcp',
                sourceIps: [...cloudflareIpV4Ranges, ...cloudflareIpV6Ranges],
            },
            {
                description: 'Allow HTTPS access from Cloudflare IPs',
                direction: 'in',
                port: '443',
                protocol: 'tcp',
                sourceIps: [...cloudflareIpV4Ranges, ...cloudflareIpV6Ranges],
            },
        ],
    },
    {
        protect: true,
    },
)

const sshFirewall = new hcloud.Firewall(
    'ssh-firewall',
    {
        name: 'ssh-firewall',
        rules: [
            {
                description: 'IP whitelist for SSH access',
                direction: 'in',
                port: '22',
                protocol: 'tcp',
                sourceIps: ipConfig.require('allow_list').split(','),
            },
        ],
    },
    { protect: true },
)

const postgresFirewall = new hcloud.Firewall(
    'postgres-firewall',
    {
        name: 'postgres-firewall',
        rules: [
            {
                description: 'IP whitelist for Postgres access',
                direction: 'in',
                port: '5432',
                protocol: 'tcp',
                sourceIps: ipConfig.require('allow_list').split(','),
            },
        ],
    },
    { protect: true },
)

const internalNetwork = new hcloud.Network(
    'internal',
    {
        deleteProtection: true,
        ipRange: '10.0.0.0/16',
        name: 'internal',
    },
    { protect: true },
)

const internalNetworkEuSubnet = new hcloud.NetworkSubnet(
    'internal-eu',
    {
        ipRange: '10.0.0.0/24',
        // @ts-expect-error Types are wrong
        networkId: internalNetwork.id,
        networkZone: 'eu-central',
        type: 'cloud',
    },
    { protect: true },
)

const databaseServer = new hcloud.Server(
    'db',
    {
        datacenter: serverConfig.require('datacenter'),
        deleteProtection: true,
        // @ts-expect-error Types are wrong
        firewallIds: [sshFirewall.id, postgresFirewall.id],
        image: serverConfig.require('image'),
        name: 'db',
        // sshKeys: [sshKey.id],
        networks: [
            {
                ip: '10.0.0.2',
                // @ts-expect-error Types are wrong
                networkId: internalNetwork.id,
            },
        ],
        rebuildProtection: true,
        serverType: serverConfig.require('type'),
    },
    {
        protect: true,
    },
)

const appServer = new hcloud.Server(
    'app',
    {
        datacenter: serverConfig.require('datacenter'),
        deleteProtection: true,
        // @ts-expect-error Types are wrong
        firewallIds: [sshFirewall.id, cloudflareFirewall.id],
        image: serverConfig.require('image'),
        name: 'app',
        networks: [
            {
                ip: '10.0.0.3',
                // @ts-expect-error Types are wrong
                networkId: internalNetwork.id,
            },
        ],
        rebuildProtection: true,
        serverType: serverConfig.require('type'),
        sshKeys: [sshKey.id],
    },
    { protect: true },
)

const adminServer = new hcloud.Server(
    'admin',
    {
        datacenter: serverConfig.require('datacenter'),
        deleteProtection: true,
        // @ts-expect-error Types are wrong
        firewallIds: [sshFirewall.id, cloudflareFirewall.id],
        image: serverConfig.require('image'),
        name: 'admin',
        networks: [
            {
                ip: '10.0.0.4',
                // @ts-expect-error Types are wrong
                networkId: internalNetwork.id,
            },
        ],
        rebuildProtection: true,
        serverType: serverConfig.require('type'),
        sshKeys: [sshKey.id],
    },
    { protect: true },
)

export const sshKeyId = sshKey.id
export const cloudflareFirewallId = cloudflareFirewall.id
export const sshFirewallId = sshFirewall.id
export const postgresFirewallId = postgresFirewall.id
export const internalNetworkId = internalNetwork.id
export const internalNetworkEuSubnetId = internalNetworkEuSubnet.id
export const databaseServerId = databaseServer.id
export const appServerId = appServer.id
export const adminServerId = adminServer.id
