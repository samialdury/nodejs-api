/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as hcloud from '@pulumi/hcloud'
import * as pulumi from '@pulumi/pulumi'

const sshConfig = new pulumi.Config('ssh')
const serverConfig = new pulumi.Config('server')
const ipConfig = new pulumi.Config('ip')

const sshKey = new hcloud.SshKey(
    'Sami-MBP',
    {
        name: 'Sami-MBP',
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
                protocol: 'tcp',
                port: '80',
                sourceIps: [...cloudflareIpV4Ranges, ...cloudflareIpV6Ranges],
            },
            {
                description: 'Allow HTTPS access from Cloudflare IPs',
                direction: 'in',
                protocol: 'tcp',
                port: '443',
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
                protocol: 'tcp',
                port: '22',
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
                protocol: 'tcp',
                port: '5432',
                sourceIps: ipConfig.require('allow_list').split(','),
            },
        ],
    },
    { protect: true },
)

const internalNetwork = new hcloud.Network(
    'internal',
    {
        name: 'internal',
        ipRange: '10.0.0.0/16',
        deleteProtection: true,
    },
    { protect: true },
)

const internalNetworkEuSubnet = new hcloud.NetworkSubnet(
    'internal-eu',
    {
        // @ts-expect-error Types are wrong
        networkId: internalNetwork.id,
        ipRange: '10.0.0.0/24',
        type: 'cloud',
        networkZone: 'eu-central',
    },
    { protect: true },
)

const databaseServer = new hcloud.Server(
    'db',
    {
        name: 'db',
        datacenter: serverConfig.require('datacenter'),
        image: serverConfig.require('image'),
        location: serverConfig.require('datacenter').split('-')[0]!,
        serverType: serverConfig.require('type'),
        deleteProtection: true,
        rebuildProtection: true,
        // @ts-expect-error Types are wrong
        firewallIds: [sshFirewall.id, postgresFirewall.id],
        // sshKeys: [sshKey.id],
        networks: [
            {
                // @ts-expect-error Types are wrong
                networkId: internalNetwork.id,
                ip: '10.0.0.2',
            },
        ],
    },
    {
        protect: true,
    },
)

const appServer = new hcloud.Server(
    'app',
    {
        name: 'app',
        datacenter: serverConfig.require('datacenter'),
        image: serverConfig.require('image'),
        location: serverConfig.require('datacenter').split('-')[0]!,
        serverType: serverConfig.require('type'),
        deleteProtection: true,
        rebuildProtection: true,
        // @ts-expect-error Types are wrong
        firewallIds: [sshFirewall.id, cloudflareFirewall.id],
        sshKeys: [sshKey.id],
        networks: [
            {
                // @ts-expect-error Types are wrong
                networkId: internalNetwork.id,
                ip: '10.0.0.3',
            },
        ],
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
