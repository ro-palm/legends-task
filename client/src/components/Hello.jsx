import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Hello = ({ userEmail }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({ name: '', description: '', status: 'Pending', dueDate: '' });
  const [modalType, setModalType] = useState('');
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [userEmail]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks?email=${userEmail}`);
      const data = await response.json();
      if (data.tasks) {
        setTasks(data.tasks);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch tasks', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch tasks', life: 3000 });
    }
  };

  const handleShowModal = (type, task = { name: '', description: '', status: 'Pending', dueDate: '' }) => {
    setModalType(type);
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask({ name: '', description: '', status: 'Pending', dueDate: '' });
  };

  const handleSaveTask = async () => {
    try {
      if (modalType === 'Add') {
        const response = await fetch('http://localhost:3001/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, task: currentTask }),
        });
        const data = await response.json();
        if (data.message === 'Task added') {
          setTasks(data.tasks);
          toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task added successfully', life: 3000 });
        }
      } else if (modalType === 'Edit') {
        const response = await fetch('http://localhost:3001/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, task: currentTask }),
        });
        const data = await response.json();
        if (data.message === 'Task updated') {
          setTasks(data.tasks);
          toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task edited successfully', life: 3000 });
        }
      }
      handleCloseModal();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save task', life: 3000 });
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, taskId: id }),
      });
      const data = await response.json();
      if (data.message === 'Task deleted') {
        setTasks(data.tasks);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task deleted successfully', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete task', life: 3000 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Tasks', 20, 10);
    const tableColumn = ["Task Name", "Description", "Status", "Due Date"];
    const tableRows = [];

    tasks.forEach(task => {
      const taskData = [
        task.name,
        task.description,
        task.status,
        task.dueDate
      ];
      tableRows.push(taskData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("tasks.pdf");
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Toast ref={toast} />
      <h1>Tasks</h1>
      <Button variant="primary" onClick={() => handleShowModal('Add')}>Add Task</Button>{' '}
      <Button variant="secondary" onClick={generatePDF}>Save as PDF</Button>
      <Table striped bordered hover style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>
                <Button variant="info" onClick={() => handleShowModal('View', task)}>View Description</Button>{' '}
                <Button variant="warning" onClick={() => handleShowModal('Edit', task)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteTask(task._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType} Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'View' ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <p><strong>Description:</strong></p>
              <p>{currentTask.description}</p>
            </div>
          ) : (
            <Form>
              <Form.Group controlId="formTaskName">
                <Form.Label>Task Name </Form.Label>
                <Form.Control type="text" name="name" value={currentTask.name} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group controlId="formTaskDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={5} name="description" value={currentTask.description} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group controlId="formTaskStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status" value={currentTask.status} onChange={handleInputChange} required>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formTaskDueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control type="date" name="dueDate" value={currentTask.dueDate} onChange={handleInputChange} required />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        {modalType !== 'View' && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={handleSaveTask}>Save changes</Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default Hello;
