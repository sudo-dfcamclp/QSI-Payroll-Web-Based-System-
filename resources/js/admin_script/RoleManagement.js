export function init(panel){
    loadRoles(panel);
    loadUsers(panel,1);

    panel.addEventListener('click',event=>{
        handlePanelClick(event,panel);
    });

    const searchInput=panel.querySelector('.role-search');
    const roleFilter=panel.querySelector('.role-filter');

    searchInput?.addEventListener('input',()=>{
        clearTimeout(searchInput._searchTimeout);

        searchInput._searchTimeout=setTimeout(()=>{
            loadUsers(panel,1);
        },300);
    });

    roleFilter?.addEventListener('change',()=>{
        loadUsers(panel,1);
    });
}

function isDarkMode(){
    return document.documentElement.classList.contains('dark');
}

function getSwalTheme(){
    return isDarkMode()
        ?{
            background:'#374151',
            color:'#f3f4f6',
            confirmButtonColor:'#16a34a',
            cancelButtonColor:'#4b5563'
        }
        :{
            background:'#ffffff',
            color:'#1f2937',
            confirmButtonColor:'#16a34a',
            cancelButtonColor:'#6b7280'
        };
}

async function loadRoles(panel){
    const rolesUrl=document.querySelector('meta[name="role-management-roles-url"]')?.getAttribute('content');
    const roleFilter=panel.querySelector('.role-filter');

    if(!rolesUrl||!roleFilter){
        return;
    }

    try{
        const response=await fetch(rolesUrl,{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'X-Requested-With':'XMLHttpRequest'
            },
            credentials:'same-origin'
        });

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

        const data=await response.json();

        if(!data.success){
            throw new Error(data.message||'Failed to load roles.');
        }

        roleFilter.innerHTML=`
            <option value="all">All Roles</option>
            ${(data.roles||[]).map(role=>`
                <option value="${role.role_id}">
                    ${escapeHtml(formatRoleName(role.role_name))}
                </option>
            `).join('')}
        `;
    }catch(error){
        console.error('Role Filter:',error);
    }
}

async function loadUsers(panel,page=1){
    const usersUrl=document.querySelector('meta[name="role-management-users-url"]')?.getAttribute('content');
    const loading=panel.querySelector('.role-loading');
    const empty=panel.querySelector('.role-empty');
    const errorState=panel.querySelector('.role-error');
    const grid=panel.querySelector('.role-users-grid');
    const pagination=panel.querySelector('.role-pagination');
    const searchInput=panel.querySelector('.role-search');
    const roleFilter=panel.querySelector('.role-filter');

    if(!usersUrl||!loading||!empty||!errorState||!grid){
        return;
    }

    loading.classList.remove('hidden');
    empty.classList.add('hidden');
    empty.classList.remove('flex');
    errorState.classList.add('hidden');
    errorState.classList.remove('flex');
    grid.classList.add('hidden');

    try{
        const url=new URL(usersUrl,window.location.origin);

        url.searchParams.set('page',page);

        const search=searchInput?.value?.trim()||'';
        const roleId=roleFilter?.value||'all';

        if(search){
            url.searchParams.set('search',search);
        }

        if(roleId!=='all'){
            url.searchParams.set('role_id',roleId);
        }

        const response=await fetch(url,{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'X-Requested-With':'XMLHttpRequest'
            },
            credentials:'same-origin'
        });

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

        const data=await response.json();

        if(!data.success){
            throw new Error(data.message||'Failed to load users.');
        }

        renderUsers(
            panel,
            data.users||[],
            data.pagination||null
        );
    }catch(error){
        console.error('Role Management:',error);

        loading.classList.add('hidden');
        errorState.classList.remove('hidden');
        errorState.classList.add('flex');

        const message=panel.querySelector('.role-error-message');

        if(message){
            message.textContent=
                error.message||
                'Something went wrong while loading the users.';
        }

        if(pagination){
            pagination.classList.add('hidden');
            pagination.innerHTML='';
        }
    }
}

function renderUsers(panel,users,paginationData){
    const loading=panel.querySelector('.role-loading');
    const empty=panel.querySelector('.role-empty');
    const grid=panel.querySelector('.role-users-grid');

    if(!loading||!empty||!grid){
        return;
    }

    loading.classList.add('hidden');

    if(!users.length){
        empty.classList.remove('hidden');
        empty.classList.add('flex');
        grid.classList.add('hidden');
        grid.innerHTML='';
        renderPagination(panel,null);
        return;
    }

    empty.classList.add('hidden');
    empty.classList.remove('flex');

    grid.innerHTML=users.map(createUserCard).join('');
    grid.classList.remove('hidden');

    renderPagination(panel,paginationData);
}

function renderPagination(panel,data){
    const pagination=panel.querySelector('.role-pagination');

    if(!pagination){
        return;
    }

    if(!data||data.last_page<=1){
        pagination.classList.add('hidden');
        pagination.innerHTML='';
        return;
    }

    const currentPage=Number(data.current_page)||1;
    const lastPage=Number(data.last_page)||1;
    const from=Number(data.from)||0;
    const to=Number(data.to)||0;
    const total=Number(data.total)||0;

    pagination.innerHTML=`
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 mt-5 border-t border-gray-100 dark:border-gray-600">
            <p class="text-sm text-gray-500 dark:text-gray-300">
                Showing
                <span class="font-medium text-gray-700 dark:text-gray-100">${from}</span>
                to
                <span class="font-medium text-gray-700 dark:text-gray-100">${to}</span>
                of
                <span class="font-medium text-gray-700 dark:text-gray-100">${total}</span>
                users
            </p>

            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="role-pagination-button cursor-pointer px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 text-sm font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    data-page="${currentPage-1}"
                    ${currentPage<=1?'disabled':''}
                >
                    <i class="fa-solid fa-chevron-left text-xs mr-1"></i>
                    Previous
                </button>

                <div class="flex items-center gap-1">
                    ${createPageButtons(currentPage,lastPage)}
                </div>

                <button
                    type="button"
                    class="role-pagination-button cursor-pointer px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 text-sm font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    data-page="${currentPage+1}"
                    ${currentPage>=lastPage?'disabled':''}
                >
                    Next
                    <i class="fa-solid fa-chevron-right text-xs ml-1"></i>
                </button>
            </div>
        </div>
    `;

    pagination.classList.remove('hidden');
}

function createPageButtons(currentPage,lastPage){
    const pages=[];

    if(lastPage<=5){
        for(let page=1;page<=lastPage;page++){
            pages.push(page);
        }
    }else{
        pages.push(1);

        if(currentPage>3){
            pages.push('...');
        }

        const start=Math.max(2,currentPage-1);
        const end=Math.min(lastPage-1,currentPage+1);

        for(let page=start;page<=end;page++){
            pages.push(page);
        }

        if(currentPage<lastPage-2){
            pages.push('...');
        }

        pages.push(lastPage);
    }

    return pages.map(page=>{
        if(page==='...'){
            return `
                <span class="px-2 text-sm text-gray-400 dark:text-gray-400">
                    ...
                </span>
            `;
        }

        const active=page===currentPage;

        return `
            <button
                type="button"
                class="role-pagination-button cursor-pointer w-9 h-9 rounded-lg text-sm font-medium transition ${
                    active
                        ?'bg-green-600 text-white'
                        :'text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-transparent'
                }"
                data-page="${page}"
            >
                ${page}
            </button>
        `;
    }).join('');
}

function createUserCard(user){
    const roles=Array.isArray(user.roles)?user.roles:[];

    const roleHtml=roles.length
        ?roles.map(role=>`
            <span class="inline-flex items-center px-2.5 py-1 rounded-md ${getRoleBadge(role.role_name)} text-xs font-medium">
                ${escapeHtml(formatRoleName(role.role_name))}
            </span>
        `).join('')
        :`
            <span class="text-sm text-gray-400 dark:text-gray-300">
                No Role
            </span>
        `;

    const accessClass=user.access==='Full Access'
        ?'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
        :'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200';

    return `
        <div
            class="relative bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            data-user-id="${escapeHtml(String(user.user_id))}"
        >
            <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-11 h-11 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-semibold shrink-0">
                        ${escapeHtml(getInitials(user.username))}
                    </div>

                    <div class="min-w-0">
                        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                            ${escapeHtml(user.username)}
                        </h3>

                        <p class="text-xs text-gray-500 dark:text-gray-300 truncate mt-1">
                            ${escapeHtml(user.email)}
                        </p>
                    </div>
                </div>

                <div class="relative shrink-0">
                    <button
                        type="button"
                        class="role-menu-button cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                        data-user-id="${user.user_id}"
                        title="More options"
                    >
                        <i class="fa-solid fa-ellipsis-vertical pointer-events-none"></i>
                    </button>

                    <div
                        class="role-menu hidden absolute right-0 top-9 z-20 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden"
                        data-menu-user-id="${user.user_id}"
                    >
                        <button
                            type="button"
                            class="role-permission-button cursor-pointer w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition"
                            data-user-id="${user.user_id}"
                        >
                            <i class="fa-solid fa-key text-gray-400 dark:text-gray-300 w-4 pointer-events-none"></i>
                            Permission
                        </button>

                        <button
                            type="button"
                            class="role-set-button cursor-pointer w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition"
                            data-user-id="${user.user_id}"
                        >
                            <i class="fa-solid fa-user-shield text-gray-400 dark:text-gray-300 w-4 pointer-events-none"></i>
                            Set Role
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-600">
                <div class="mb-4">
                    <p class="text-xs font-medium text-gray-400 dark:text-gray-300 uppercase tracking-wide mb-2">
                        Role
                    </p>

                    <div class="flex flex-wrap gap-2">
                        ${roleHtml}
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-gray-400 dark:text-gray-300 uppercase tracking-wide">
                        Access
                    </p>

                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${accessClass}">
                        ${escapeHtml(user.access||'Limited Access')}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function getRoleBadge(roleName){
    const normalized=String(roleName||'').toLowerCase();

    if(normalized==='payroll'){
        return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    }

    if(normalized==='hr'){
        return 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
    }

    if(normalized==='admin'){
        return 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
    }

    return 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200';
}

async function openPermissionModal(userId,panel){
    if(typeof Swal==='undefined'){
        console.error('SweetAlert2 is not loaded.');
        return;
    }

    const theme=getSwalTheme();

    const rolesUrl=document.querySelector('meta[name="role-management-roles-url"]')?.getAttribute('content');

    const userRolesBaseUrl=document.querySelector('meta[name="role-management-user-roles-url"]')?.getAttribute('content');

    const userRolesUrl=userRolesBaseUrl
        ?`${userRolesBaseUrl.replace(/\/$/,'')}/${userId}/roles`
        :null;

    if(!rolesUrl||!userRolesUrl){
        Swal.fire({
            icon:'error',
            title:'Configuration Error',
            text:'Role management URLs are missing.',
            background:theme.background,
            color:theme.color,
            confirmButtonColor:theme.confirmButtonColor,
            cancelButtonColor:theme.cancelButtonColor
        });

        return;
    }

    try{
        const [rolesResponse,userRolesResponse]=await Promise.all([
            fetch(rolesUrl,{
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'X-Requested-With':'XMLHttpRequest'
                },
                credentials:'same-origin'
            }),

            fetch(userRolesUrl,{
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'X-Requested-With':'XMLHttpRequest'
                },
                credentials:'same-origin'
            })
        ]);

        if(!rolesResponse.ok||!userRolesResponse.ok){
            throw new Error('Failed to load role data.');
        }

        const rolesData=await rolesResponse.json();
        const userRolesData=await userRolesResponse.json();

        if(!rolesData.success||!userRolesData.success){
            throw new Error('Failed to load role data.');
        }

        const assignedRoles=new Set(
            (userRolesData.role_ids||[]).map(Number)
        );

        const roleRows=(rolesData.roles||[]).map(role=>`
            <label class="cursor-pointer flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-100 cursor-pointer">
                    ${escapeHtml(formatRoleName(role.role_name))}
                </span>

                <input
                    type="checkbox"
                    class="role-checkbox cursor-pointer w-4 h-4"
                    data-role-id="${role.role_id}"
                    ${assignedRoles.has(Number(role.role_id))?'checked':''}
                >
            </label>
        `).join('');

        await Swal.fire({
            title:'Permissions',
            html:`
                <div class="text-left border border-gray-200 dark:border-gray-500 rounded-lg overflow-hidden">
                    ${
                        roleRows||
                        '<div class="px-4 py-5 text-sm text-gray-500 dark:text-gray-300 text-center">No roles available.</div>'
                    }
                </div>

                <div class="flex justify-end gap-2 mt-5">
                    <button
                        type="button"
                        id="role-cancel-button"
                        class="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="role-save-button"
                        class="cursor-pointer px-4 py-2 rounded-lg bg-green-600 text-sm font-medium text-white hover:bg-green-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            `,
            background:theme.background,
            color:theme.color,
            showConfirmButton:false,
            showCloseButton:true,
            width:500,
            allowOutsideClick:true,
            allowEscapeKey:true,

            didOpen:popup=>{
                const saveButton=popup.querySelector('#role-save-button');
                const cancelButton=popup.querySelector('#role-cancel-button');
                const checkboxes=popup.querySelectorAll('.role-checkbox');

                if(saveButton){
                    saveButton.addEventListener('click',async()=>{
                        await saveRoleChanges(
                            userId,
                            checkboxes,
                            assignedRoles,
                            saveButton,
                            cancelButton,
                            panel
                        );
                    });
                }

                if(cancelButton){
                    cancelButton.addEventListener('click',()=>{
                        Swal.close();
                    });
                }
            }
        });
    }catch(error){
        console.error('Permission Modal:',error);

        const theme=getSwalTheme();

        Swal.fire({
            icon:'error',
            title:'Error',
            text:error.message||'Unable to load roles.',
            background:theme.background,
            color:theme.color,
            confirmButtonColor:theme.confirmButtonColor,
            cancelButtonColor:theme.cancelButtonColor
        });
    }
}

async function saveRoleChanges(
    userId,
    checkboxes,
    originalRoles,
    saveButton,
    cancelButton,
    panel
){
    const updateBaseUrl=document.querySelector('meta[name="role-management-update-role-url"]')?.getAttribute('content');

    const updateUrl=updateBaseUrl
        ?`${updateBaseUrl.replace(/\/$/,'')}/${userId}/roles`
        :null;

    if(!updateUrl){
        showToast('Role update URL is missing.','error');
        return;
    }

    const changes=[];

    checkboxes.forEach(checkbox=>{
        const roleId=Number(checkbox.dataset.roleId);
        const assigned=checkbox.checked;
        const original=originalRoles.has(roleId);

        if(assigned!==original){
            changes.push({
                roleId,
                assigned
            });
        }
    });

    if(!changes.length){
        showToast('No changes to save.','info');
        return;
    }

    saveButton.disabled=true;
    cancelButton.disabled=true;

    saveButton.innerHTML=`
        <i class="fa-solid fa-spinner fa-spin mr-2"></i>
        Saving...
    `;

    try{
        for(const change of changes){
            const response=await fetch(updateUrl,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Accept':'application/json',
                    'X-Requested-With':'XMLHttpRequest',
                    'X-CSRF-TOKEN':getCsrfToken()
                },
                credentials:'same-origin',
                body:JSON.stringify({
                    role_id:change.roleId,
                    assigned:change.assigned
                })
            });

            const data=await response.json();

            if(!response.ok||!data.success){
                throw new Error(
                    data.message||'Failed to update role.'
                );
            }
        }

        Swal.close();

        showToast(
            'Role changes saved successfully.',
            'success'
        );

        await loadUsers(panel,1);
    }catch(error){
        console.error('Role Update:',error);

        showToast(
            error.message||'Failed to save role changes.',
            'error'
        );

        saveButton.disabled=false;
        cancelButton.disabled=false;
        saveButton.innerHTML='Save Changes';
    }
}

function showToast(message,icon='success'){
    if(typeof Swal==='undefined'){
        console.log(message);
        return;
    }

    const theme=getSwalTheme();

    Swal.fire({
        toast:true,
        position:'top-end',
        icon,
        title:message,
        showConfirmButton:false,
        timer:2500,
        timerProgressBar:true,
        background:theme.background,
        color:theme.color,
        confirmButtonColor:theme.confirmButtonColor,
        cancelButtonColor:theme.cancelButtonColor
    });
}

function handlePanelClick(event,panel){
    const paginationButton=event.target.closest('.role-pagination-button');

    if(paginationButton){
        if(paginationButton.disabled){
            return;
        }

        const page=Number(paginationButton.dataset.page);

        if(!page){
            return;
        }

        closeAllRoleMenus(panel);
        loadUsers(panel,page);

        return;
    }

    const menuButton=event.target.closest('.role-menu-button');

    if(menuButton){
        event.stopPropagation();

        const userId=menuButton.dataset.userId;

        const menu=panel.querySelector(
            `.role-menu[data-menu-user-id="${userId}"]`
        );

        if(!menu){
            return;
        }

        const isOpen=!menu.classList.contains('hidden');

        closeAllRoleMenus(panel);

        if(isOpen){
            return;
        }

        menu.classList.remove('hidden');

        menu.animate(
            [
                {
                    opacity:0,
                    transform:'translateY(-4px)'
                },
                {
                    opacity:1,
                    transform:'translateY(0)'
                }
            ],
            {
                duration:150,
                easing:'ease-out'
            }
        );

        return;
    }

    const permissionButton=event.target.closest('.role-permission-button');

    if(permissionButton){
        const userId=permissionButton.dataset.userId;

        closeAllRoleMenus(panel);
        openPermissionModal(userId,panel);

        return;
    }

    const setRoleButton=event.target.closest('.role-set-button');

    if(setRoleButton){
        const userId=setRoleButton.dataset.userId;

        closeAllRoleMenus(panel);
        openSetRoleModal(userId);

        return;
    }

    if(!event.target.closest('.role-menu')){
        closeAllRoleMenus(panel);
    }
}

function closeAllRoleMenus(panel){
    panel.querySelectorAll('.role-menu').forEach(menu=>{
        menu.classList.add('hidden');
    });
}

function openSetRoleModal(userId){
    if(typeof Swal==='undefined'){
        console.error('SweetAlert2 is not loaded.');
        return;
    }

    const theme=getSwalTheme();

    Swal.fire({
        icon:'info',
        title:'Set Role',
        text:'Role assignment is managed through the Permission option.',
        confirmButtonText:'OK',
        background:theme.background,
        color:theme.color,
        confirmButtonColor:theme.confirmButtonColor,
        cancelButtonColor:theme.cancelButtonColor
    });
}

function getCsrfToken(){
    return document.querySelector(
        'meta[name="csrf-token"]'
    )?.getAttribute('content')||'';
}

function formatRoleName(roleName){
    return String(roleName||'')
        .replace(/[_-]+/g,' ')
        .replace(/\b\w/g,char=>char.toUpperCase());
}

function getInitials(username){
    const value=String(username||'').trim();

    if(!value){
        return '?';
    }

    const parts=value.split(/\s+/);

    if(parts.length===1){
        return parts[0].substring(0,2).toUpperCase();
    }

    return (
        parts[0][0]+
        parts[parts.length-1][0]
    ).toUpperCase();
}

function escapeHtml(value){
    return String(value??'')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
}