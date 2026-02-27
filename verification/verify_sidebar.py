from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    page.goto("http://localhost:3000")

    # Wait for the sidebar to be visible
    page.wait_for_selector("text=Anatomy Explorer", timeout=10000)

    # Take a screenshot of the default view (Systems tab)
    page.screenshot(path="verification/systems_tab.png")
    print("Captured systems_tab.png")

    # Click on the Skeletal tab
    # The button has text "Skeletal"
    skeletal_btn = page.get_by_role("button", name="Skeletal")
    if skeletal_btn.is_visible():
        skeletal_btn.click()
        # Wait for the content of the Skeletal tab
        page.wait_for_selector("text=Skeletal System", timeout=10000)
        page.wait_for_timeout(1000) # Give it a moment to render
        page.screenshot(path="verification/skeletal_tab.png")
        print("Captured skeletal_tab.png")
    else:
        print("Skeletal button not visible")

    # Click on the Diseases tab
    diseases_btn = page.get_by_role("button", name="Diseases")
    if diseases_btn.is_visible():
        diseases_btn.click()
        # Wait for the content of the Diseases tab
        page.wait_for_selector("text=Conditions & Pathology", timeout=10000)
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/diseases_tab.png")
        print("Captured diseases_tab.png")
    else:
        print("Diseases button not visible")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
