const API_URL = CONFIG.API_URL;

const elements = {
    // View Elements
    viewMode: document.getElementById('viewMode'),
    viewName: document.getElementById('viewName'),
    viewEmail: document.getElementById('viewEmail'),
    viewInterests: document.getElementById('viewInterests'),
    editBtn: document.getElementById('editBtn'),
    
    // Edit Elements
    editMode: document.getElementById('editMode'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    interests: document.getElementById('interests'),
    saveBtn: document.getElementById('saveBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    
    // Shared/Image Elements
    profilePic: document.getElementById('profilePic'),
    imageInput: document.getElementById('imageInput'),
    editImageWrapper: document.getElementById('editImageWrapper')
};

const toggleMode = (isEdit) => {
    elements.viewMode.style.display = isEdit ? 'none' : 'block';
    elements.editMode.style.display = isEdit ? 'block' : 'none';
    elements.editImageWrapper.style.display = isEdit ? 'block' : 'none';
};

const setLoading = (isLoading) => {
    elements.saveBtn.textContent = isLoading ? 'Saving...' : 'Save Changes';
    elements.saveBtn.classList.toggle('loading', isLoading);
    elements.saveBtn.disabled = isLoading;
    elements.cancelBtn.disabled = isLoading;
};

const showError = (message) => {
    alert(message); // In a real app, use a toast or modal
};

const loadProfile = async () => {
    try {
        const res = await fetch(`${API_URL}/get-profile`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        
        const data = await res.json();
        
        // Update View Mode
        elements.viewName.textContent = data.name || 'Not set';
        elements.viewEmail.textContent = data.email || 'Not set';
        elements.viewInterests.textContent = data.interests && data.interests.length > 0 ? data.interests.join(', ') : 'None';
        
        // Update Edit Mode Inputs
        elements.name.value = data.name || '';
        elements.email.value = data.email || '';
        elements.interests.value = data.interests ? data.interests.join(', ') : '';
        
        // Update Image
        if (data.profilePicture) {
            // If it's a base64 string, it works directly. 
            // If it was a filename (legacy), we might need to handle it, but we are moving to base64.
            // The backend now returns the full data URI string.
            if (data.profilePicture.startsWith('data:')) {
                 elements.profilePic.src = data.profilePicture;
            } else {
                // Fallback for legacy data if any
                 elements.profilePic.src = `${API_URL}/uploads/${data.profilePicture}`;
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Could not load profile data');
    }
};

const updateProfileData = async () => {
    const profile = {
        name: elements.name.value,
        email: elements.email.value,
        interests: elements.interests.value
    };

    const res = await fetch(`${API_URL}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update profile');
    }
};

const updateProfileImage = async () => {
    const imgFile = elements.imageInput.files[0];
    if (!imgFile) return;

    const formData = new FormData();
    formData.append('image', imgFile);

    const res = await fetch(`${API_URL}/profile-picture`, {
        method: 'PUT',
        body: formData
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to upload image');
    }
};

const handleSave = async () => {
    setLoading(true);
    try {
        await updateProfileData();
        await updateProfileImage();
        
        await loadProfile(); // Reload to show updates
        toggleMode(false); // Switch back to view mode
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        showError(error.message);
    } finally {
        setLoading(false);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    
    elements.editBtn.addEventListener('click', () => toggleMode(true));
    elements.cancelBtn.addEventListener('click', () => {
        toggleMode(false);
        loadProfile(); // Reset inputs to current data
    });
    elements.saveBtn.addEventListener('click', handleSave);
});
