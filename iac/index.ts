/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as hcloud from '@pulumi/hcloud'
import * as pulumi from '@pulumi/pulumi'

const sshConfig = new pulumi.Config('ssh')
const serverConfig = new pulumi.Config('server')

const sshKey = new hcloud.SshKey(
    'Sami-MBP',
    {
        name: 'Sami-MBP',
        publicKey: sshConfig.require('public_key'),
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

const [cloudflareIpV4Ranges, cloudflareIpV6Ranges] = await Promise.all([
    getCloudflareIpRanges('v4'),
    getCloudflareIpRanges('v6'),
])

const cloudflareFirewall = new hcloud.Firewall(
    'cloudflare-firewall',
    {
        name: 'cloudflare-firewall',
        rules: [
            {
                description: 'Allow HTTP from Cloudflare IPs',
                direction: 'in',
                protocol: 'tcp',
                port: '80',
                sourceIps: [...cloudflareIpV4Ranges, ...cloudflareIpV6Ranges],
            },
            {
                description: 'Allow HTTPS from Cloudflare IPs',
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

const databaseServer = new hcloud.Server(
    'db',
    {
        name: 'db',
        datacenter: serverConfig.require('datacenter'),
        image: serverConfig.require('image'),
        location: serverConfig.require('datacenter').split('-')[0]!,
        serverType: serverConfig.require('type'),
        // @ts-expect-error Types are wrong
        firewallIds: [cloudflareFirewall.id],
        // sshKeys: [sshKey.id],
    },
    {
        protect: true,
    },
)

export const sshKeyId = sshKey.id
export const cloudflareFirewallId = cloudflareFirewall.id
export const databaseServerId = databaseServer.id
