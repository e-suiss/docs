"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { usePathname } from "next/navigation";

import { Anchor } from "@/components/site/anchor";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Group = { label?: string; nodes: PageTree.Node[] };

/** Splits a folder's children into groups at each separator ("---Label---" in meta.json). */
function groupNodes(nodes: PageTree.Node[]) {
  const groups: Group[] = [{ nodes: [] }];
  for (const node of nodes) {
    if (node.type === "separator") {
      groups.push({ label: String(node.name ?? ""), nodes: [] });
    } else {
      groups.at(-1)?.nodes.push(node);
    }
  }
  return groups.filter((group) => group.nodes.length > 0);
}

function Pages({ nodes }: { nodes: PageTree.Node[] }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return nodes.map((node) => {
    if (node.type === "page") {
      return (
        <SidebarMenuItem key={node.url}>
          <SidebarMenuButton
            size="sm"
            isActive={pathname === node.url}
            className="text-sm"
            render={<Anchor href={node.url} onClick={() => setOpenMobile(false)} />}
          >
            {node.name}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    if (node.type === "folder") {
      return (
        <SidebarMenuItem key={node.$id ?? String(node.name)}>
          {node.index ? (
            <SidebarMenuButton
              size="sm"
              isActive={pathname === node.index.url}
              className="text-sm"
              render={<Anchor href={node.index.url} onClick={() => setOpenMobile(false)} />}
            >
              {node.name}
            </SidebarMenuButton>
          ) : (
            <span className="flex h-8 items-center px-2 text-sm text-label-secondary">
              {node.name}
            </span>
          )}
          <SidebarMenuSub>
            {node.children.map((child) =>
              child.type === "page" ? (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton
                    isActive={pathname === child.url}
                    render={<Anchor href={child.url} onClick={() => setOpenMobile(false)} />}
                  >
                    {child.name}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ) : null,
            )}
          </SidebarMenuSub>
        </SidebarMenuItem>
      );
    }
    return null;
  });
}

/**
 * The docs navigator: esuiss-ui's sidebar, pinned below the product bar
 * (DocC keeps its navigator under the sticky nav, not over it).
 */
export function DocsSidebar({ nodes }: { nodes: PageTree.Node[] }) {
  return (
    <Sidebar className="sticky top-13 h-[calc(100svh-(--spacing(13)))] border-e-0 [&>[data-slot=sidebar-inner]]:bg-surface">
      <SidebarContent className="py-4 tracking-[-0.016em]">
        {groupNodes(nodes).map((group, index) => (
          <SidebarGroup key={group.label ?? index}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                <Pages nodes={group.nodes} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
